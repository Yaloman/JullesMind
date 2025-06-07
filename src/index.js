// Vi starter med src/index.js og bygger hele bot-strukturen steg for steg


// src/index.js
console.log("🚀 Starter botten...");
console.log("🚀 Starter botten...2");
require('dotenv').config();
console.log("🚀 Starter botten...3");
console.log("Step 1 - Starter botten...");
const tickets = require('../utils/tickets.js');
const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
console.log("Step 2 - Discord.js importert");
const mongoose = require('mongoose');
const fs = require('fs');
console.log("Step 3 - FS loaded");

const path = require('path');
console.log("Step 4 - Path loaded");

console.log("🚀 Starter botten..5.");

const loadCommands = require('../handlers/commandHandler');

console.log("📦 Importerer distubeClient...");
const setupDistube = require('../utils/distubeClient');
console.log("✅ distubeClient importert!");
const connectDB = require('../database/db');
console.log("🚀 Starter botten..8.");
const Security = require('../database/schemas/Security');
console.log("🚀 Starter botten...9");
const Deploy = require('../deploy')
console.log("🚀 Starter botten...10");
const { isInConversation, startConversation } = require('../utils/conversationManager');
const saveMessage = require('../handlers/saveMemory');
const getBotReply = require('../handlers/getResponse');
const spamMap = new Map(); // userId -> timestamp or count
const { logEvent, Register } = require('../utils/logger.js');
const Dashi = require('../utils/dashi/index.js'); // Assuming 'dashi' is installed via npm or in your project
const Ticket = require('../database/schemas/Ticket');

const rId = require('random-id')
fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    console.log('IP Address:', data.ip);
  })
  .catch(error => {
    console.error('Error fetching IP address:', error);
  });
  
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});
console.log("🚀 Starter botten...12");
client.commands = new Collection();
client.slashCommands = new Collection();
client.prefix = '!';
const rId2 = rId(10, 'A20');
// Load
setupDistube(client);
connectDB();
loadCommands(client);
const dashi = new Dashi({
  apiUrl: process.env.api, // replace with real dashboard API URL
  token: rId2
});

const VerificationSchema = new mongoose.Schema({
  discordId: String,
  email: String,
  code: String,
  verified: Boolean
});

const Verification = mongoose.models.Verification || mongoose.model('Verification', VerificationSchema);


client.once('ready', async() => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  const GUILD_ID = process.env.GUILD_ID;
  const VERIFIED_ROLE_ID = process.env.VERIFIED_ROLE_ID;
  const NEW_ROLE_ID = process.env.NEW_ROLE_ID;

  const guild = await client.guilds.fetch(GUILD_ID);

  // Poll every 5 seconds
  setInterval(async () => {
    try {
      const verifiedUsers = await Verification.find({ verified: true });

      for (const user of verifiedUsers) {
        const member = await guild.members.fetch(user.discordId).catch(() => null);
        if (!member) continue;

        if (member.roles.cache.has(VERIFIED_ROLE_ID)) continue; // Already verified

        // Add role
        await member.roles.add(VERIFIED_ROLE_ID).catch(console.error);

        // Optionally remove 'new' role
        await member.roles.remove(NEW_ROLE_ID).catch(() => {});

        console.log(`✅ Gave ${member.user.tag} the verified role.`);

        // Optional: mark as processed (e.g., `processed: true`)
        // Or delete the entry to avoid repeating
        await Verification.deleteOne({ discordId: user.discordId });
      }
    } catch (err) {
      console.error('❌ Polling error:', err);
    }
  }, 5000);




const verificationChannelId = process.env.VERIFICATION_CHANNEL_ID;
  const channel = await client.channels.fetch(verificationChannelId);

  if (!channel || !channel.isTextBased()) {
    return console.error('❌ Verification channel not found or not text-based!');
  }

  // Delete previous messages
  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    await channel.bulkDelete(messages, true);
    console.log('🧹 Cleared previous messages in verification channel.');
  } catch (err) {
    console.warn('⚠️ Could not bulk delete messages:', err);
  }

  // Create verification button
  const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

  const embed = new EmbedBuilder()
    .setTitle('🔒 Verify Your Account')
    .setDescription('Click the button below to start the verification process.')
    .setColor(0x00AE86);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('verify_start')
      .setLabel('Start Verification')
      .setStyle(ButtonStyle.Primary)
  );

  await channel.send({ embeds: [embed], components: [row] });

  console.log('✅ Verification message sent.');


  
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




  console.log("Loading LogEvent for Bot");

  const Logpath = Register();

  client.user.log = Logpath;
  await console.log("✅ Register for Logevent 8")
  
  

});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'close_ticket') return tickets.close(client,interaction);
  if (interaction.isButton() && interaction.customId === 'delete_ticket') return tickets.del(client,interaction);
  if (interaction.isButton() && interaction.customId === 'reopen_ticket') return tickets.reopen(client,interaction);
  if (interaction.customId === 'verify_start') {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.user;

    try {
      await user.send({
        content: `👋 Hello, ${user.username}!\n\nClick the link below to start the verification process:\n\n🔗 **[Verify Here](http://localhost:3000/verify)**`,
      });

      await interaction.editReply({
        content: '📩 Check your DMs for the verification link!',
        ephemeral: true,
      });

      console.log(`📤 Sent verification DM to ${user.tag}`);
    } catch (err) {
      console.error(`❌ Could not send DM to ${user.tag}:`, err);
      await interaction.editReply({
        content: '❌ I couldn’t send you a DM. Please check your privacy settings!',
        ephemeral: true,
      });
    }
  }
  if (interaction.isButton() && interaction.customId === 'trans_ticket') {
  await interaction.deferReply({ ephemeral: true });

  const transcript = await tickets.createTranscriptInDb(interaction.channel);
  const user = await interaction.guild.members.fetch(transcript.t.userId).catch(() => null);

  // Lag embed
 const transcriptEmbed = new EmbedBuilder()
  .setTitle('📄 Transcript for ticket')
  .setDescription('Her er transcripten for ticketen din. Klikk på knappen under for å åpne filen.')
  .setColor(0x0099ff); // hex uten #, som tall

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setLabel('Åpne transcript')
    .setStyle(ButtonStyle.Link)
    .setURL(`${process.env.api}/transcripts?file=${transcript.Id}`)
);

  // Send DM med embed + knapp
  if (user) {
    await user.send({ embeds: [transcriptEmbed], components: [row] }).catch(() => console.log('Kunne ikke sende DM'));
  }

  // Send melding i ticket-kanalen med embed + knapp
  await interaction.channel.send({
    content: '✅ Transcript har blitt lagd og lagret!',
    embeds: [transcriptEmbed],
    components: [row]
  });

  // Svar på interaksjonen
  return await interaction.editReply({ content: '✅ Transcript sendt til brukeren!', ephemeral: true });
}

  
  if (interaction.isButton() && interaction.customId === 'create_ticket') return tickets.create(client , interaction, interaction.message.id);
  if (!interaction.isCommand()) return;
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }

  
});
const MAX_DISCORD_LENGTH = 2000;

function splitMessageWithPrefix(content, prefix = '', suffix = '') {
  const maxLength = MAX_DISCORD_LENGTH - prefix.length - suffix.length;
  const parts = [];

  while (content.length > maxLength) {
    let sliceIndex = content.lastIndexOf('\n', maxLength);
    if (sliceIndex === -1) sliceIndex = maxLength;

    parts.push(content.slice(0, sliceIndex));
    content = content.slice(sliceIndex);
  }

  if (content.length > 0) parts.push(content);

  return parts;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  if (message.author.bot) return;

 const userId = message.author.id;



if (isInConversation(userId)) {
  await saveMessage(userId, message.content);
const response = await getBotReply(userId, message.content);
await saveMessage(userId, response);



// Split and send message parts
const messageParts = splitMessageWithPrefix(response);
const totalParts = messageParts.length;

await message.channel.send(`<@${userId}> **Part 1/${totalParts}**\n${messageParts[0]}`);

for (let i = 1; i < totalParts; i++) {
  await message.channel.send(`**Part ${i + 1}/${totalParts}**\n${messageParts[i]}`);
}

startConversation(userId, async () => {
  await message.channel.send(`<@${userId}> AI chat ended due to inactivity.`);
});
}


  const settings = await Security.findOne({ guildId: message.guild.id });
  const prefix = client.prefix || '!';

  // Anti-link
  if (settings?.antiLink) {
    const linkRegex = /(https?:\/\/[^\s]+)/gi;
    if (linkRegex.test(message.content)) {
      try {
        await message.delete();
        await message.channel.send({
          content: `🚫 ${message.author}, links are not allowed here.`,
          ephemeral: true
        });
        return;
      } catch (err) {
        console.error('Failed to delete message or warn user:', err);
      }
    }
  }

  // Anti-spam
  if (settings?.antiSpam) {
    const key = `${message.guild.id}_${message.author.id}`;
    const current = spamMap.get(key) || { count: 0, lastMsg: Date.now() };

    if (Date.now() - current.lastMsg < 3000) {
      current.count++;
    } else {
      current.count = 1;
    }
    current.lastMsg = Date.now();
    spamMap.set(key, current);

    if (current.count >= 5) {
      try {
        await message.delete();
        await message.channel.send(`🚨 ${message.author}, stop spamming!`);
        return;
      } catch (err) {
        console.error('Error handling spam:', err);
      }
    }
  }

  // Kommandoer
  if (!message.content.startsWith(prefix)) return await logEvent(client, message.guild.id, 'message', `${message.author.tag}: ${message.content}`);
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {

    await command.execute(message, args, client);
  } catch (error) {
    console.error(`❌ Error executing command ${commandName}:`, error);
    message.reply('Det oppstod en feil når kommandoen skulle kjøres.');
  }
});

client.on('guildMemberAdd', async (member) => {

  const { id: discordId } = member.user;

  // Add 'new' role
  const NEW_ROLE_ID = process.env.NEW_ROLE_ID;
  
  try {
    await member.roles.add(NEW_ROLE_ID);
    console.log(`✅ Added 'new' role to ${member.user.tag}`);
    const channel2 = await client.channels.fetch(process.env.VERIFICATION_CHANNEL_ID);
    const message = await channel2.send(`<@${discordId}`);

    await message.delete();

  } catch (error) {
    console.error(`❌ Failed to add 'new' role to ${member.user.tag}:`, error);
  }

  // Optional: Create verification DB entry here



  // Create a document if it doesn't exist
  const existing = await Verification.findOne({ discordId });

  if (!existing) {
    await Verification.create({
      discordId,
      email: null,
      code: null,
      verified: false
    });
    console.log(`📥 Created verification doc for ${member.user.tag}`);
  } else {
    console.log(`⚠️ Verification doc already exists for ${member.user.tag}`);
  }
  
});




client.login(process.env.BOT_TOKEN)
  .then(() => console.log("🟢 Botten logget inn"))
  .catch(err => {
    console.error("❌ Klarte ikke å logge inn:", err);
    process.exit(1);
  });

