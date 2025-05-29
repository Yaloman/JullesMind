// Vi starter med src/index.js og bygger hele bot-strukturen steg for steg

// src/index.js
console.log("🚀 Starter botten...");
require('dotenv').config();
console.log("🚀 Starter botten...2");
const { Client, GatewayIntentBits, Collection } = require('discord.js');
console.log("🚀 Starter botten...3");
const fs = require('fs');
console.log("🚀 Starter botten...4");
const path = require('path');
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


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});
console.log("🚀 Starter botten...12");
client.commands = new Collection();
client.slashCommands = new Collection();
client.prefix = '!';

// Load
setupDistube(client);
connectDB();
loadCommands(client);

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
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
  if (!message.content.startsWith(prefix)) return;
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




client.login(process.env.BOT_TOKEN)
  .then(() => console.log("🟢 Botten logget inn"))
  .catch(err => {
    console.error("❌ Klarte ikke å logge inn:", err);
    process.exit(1);
  });

