// src/index.js
console.log("🚀 Starter botten...");
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Settings = require('../database/schemas/Settings');
const loadCommands = require('../handlers/commandHandler');
const setupDistube = require('../utils/distubeClient');
const connectDB = require('../database/db');
const Security = require('../database/schemas/Security');
const saveMessage = require('../handlers/saveMemory');
const getBotReply = require('../handlers/getResponse');
const { logEvent, Register } = require('../utils/logger.js');
const tickets = require('../utils/tickets.js');
const Dashi = require('../utils/dashi/index.js');
const Ticket = require('../database/schemas/Ticket');
const rId = require('random-id');
const deployToGuild = require('../deploy');
const { isInConversation, startConversation } = require('../utils/conversationManager');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.prefix = '!';
const dashi = new Dashi({
  apiUrl: process.env.api,
  token: rId(10, 'A20')
});

const VerificationSchema = new mongoose.Schema({
  discordId: String,
  email: String,
  code: String,
  verified: Boolean
});

const Verification = mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);

setupDistube(client);
connectDB();
loadCommands(client);

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  await Promise.all(client.guilds.cache.map(async (guild) => {
    await deployToGuild(guild.id);
  }));

  client.on('guildCreate', async (guild) => {
    await deployToGuild(guild.id);
  });

  const Logpath = Register();
  client.user.log = Logpath;
  console.log("✅ Log path registered.");

  await dashi.register({
    clientId: client.user.id,
    username: client.user.username,
    avatar: client.user.displayAvatarURL(),
    guildCount: client.guilds.cache.size,
    users: client.users.cache.size,
    latency: client.ws.ping,
    invite: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
  });

  await dashi.sendUpdate(() => ({
    clientId: client.user.id,
    username: client.user.username,
    guildCount: client.guilds.cache.size,
    users: client.users.cache.size,
    latency: client.ws.ping,
    avatar: client.user.displayAvatarURL(),
    invite: `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
  }));

  for (const [guildId, guild] of client.guilds.cache) {
    const settings = await Settings.findOne({ guildId });
    if (!settings?.verify || !settings.verificationChannelId) continue;

    const channel = await client.channels.fetch(settings.verificationChannelId).catch(() => null);
    if (!channel?.isTextBased()) continue;

    try {
      const messages = await channel.messages.fetch({ limit: 100 });
      await channel.bulkDelete(messages, true);
    } catch (err) {
      console.warn('⚠️ Could not bulk delete messages:', err);
    }

    const embed = new EmbedBuilder()
      .setTitle('🔒 Verify Your Account')
      .setDescription('Click the button below to start the verification process.')
      .setColor(0x00AE86);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('verify_start').setLabel('Start Verification').setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });
    console.log(`✅ Verification message sent to guild ${guildId}`);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case 'verify_start': {
          await interaction.deferReply({ ephemeral: true });
          const user = interaction.user;
          try {
            await user.send({ content: `👋 Hello, ${user.username}!

Click to verify: ${process.env.DASHBOARD_URL}/verify` });
            await interaction.editReply({ content: '📩 Check your DMs!', ephemeral: true });
          } catch (err) {
            console.error(`❌ DM to ${user.tag} failed:`, err);
            await interaction.editReply({ content: '❌ Could not send DM. Check privacy settings!', ephemeral: true });
          }
          break;
        }
        case 'close_ticket': return tickets.close(client, interaction);
        case 'delete_ticket': return tickets.del(client, interaction);
        case 'reopen_ticket': return tickets.reopen(client, interaction);
        case 'trans_ticket': {
          await interaction.deferReply({ ephemeral: true });
          const transcript = await tickets.createTranscriptInDb(interaction.channel);
          const user = await interaction.guild.members.fetch(transcript.t.userId).catch(() => null);

          const embed = new EmbedBuilder()
            .setTitle('📄 Transcript')
            .setDescription('Click below to open.')
            .setColor(0x0099ff);

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Open Transcript').setStyle(ButtonStyle.Link).setURL(`${process.env.api}/transcripts?file=${transcript.Id}`)
          );

          if (user) await user.send({ embeds: [embed], components: [row] }).catch(() => {});
          await interaction.channel.send({ embeds: [embed], components: [row] });
          return await interaction.editReply({ content: '✅ Transcript sent!', ephemeral: true });
        }
        case 'create_ticket': return tickets.create(client, interaction, interaction.message.id);
      }
    }

    if (interaction.isCommand()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (command) await command.execute(interaction, client);
    }
  } catch (error) {
    console.error('❌ Interaction error:', error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: '⚠️ Error occurred.', ephemeral: true });
    } else {
      await interaction.reply({ content: '⚠️ Error occurred.', ephemeral: true });
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  const { id: discordId } = member.user;
  const settings = await Settings.findOne({ guildId: member.guild.id });
  const verificationChannelId = settings?.verificationChannelId;

  if (settings?.verify_nrole) {
    try {
      await member.roles.add(settings.verify_nrole);
    } catch (err) {
      console.error(`❌ Failed to add role to ${member.user.tag}:`, err);
    }
  }

  if (verificationChannelId) {
    const channel = await member.client.channels.fetch(verificationChannelId).catch(() => null);
    if (channel) {
      const msg = await channel.send(`<@${discordId}>`).catch(() => null);
      if (msg) await msg.delete().catch(() => {});
    }
  }

  const existing = await Verification.findOne({ discordId });
  if (!existing) await Verification.create({ discordId, email: null, code: null, verified: false });
});

client.login(process.env.BOT_TOKEN).then(() => console.log("🟢 Bot logged in")).catch(err => {
  console.error("❌ Failed to login:", err);
  process.exit(1);
});
