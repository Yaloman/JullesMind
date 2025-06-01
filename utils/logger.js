// utils/logger.js
const fs = require('fs');
const path = require('path');
const Logs2 = require('../database/schemas/Logs2');

const logChannelCache = new Map(); // guildId -> channel

async function fetchLogChannel(client, guildId) {
  // Check cache first
  if (logChannelCache.has(guildId)) {
    return logChannelCache.get(guildId);
  }

  // Fetch from DB
  const config = await Logs2.findOne({ guildId });
  if (!config) return null;

  try {
    const channel = await client.channels.fetch(config.logChannelId);
    if (channel) {
      logChannelCache.set(guildId, channel);
      return channel;
    }
  } catch (err) {
    console.error(`[Logger] Failed to fetch log channel: ${err.message}`);
  }

  return null;
}

function logToFile(type, message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${type.toUpperCase()}]: ${message}`;
  const logPath = path.join(__dirname, '..', 'logs', 'bot.log');

  fs.appendFileSync(logPath, logLine + '\n');
  console.log(logLine);
}

async function logEvent(client, guildId, type, message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] [${type.toUpperCase()}]: ${message}`;

  // Log to file and console
  logToFile(type, message);

  // Log to Discord channel if set
  if (!guildId) return;

  const channel = await fetchLogChannel(client, guildId);
  if (channel) {
    channel.send(`\`\`\`\n${logLine.slice(0, 1990)}\n\`\`\``).catch(console.error); // safe length
  }
}

module.exports = {
  logEvent
};
