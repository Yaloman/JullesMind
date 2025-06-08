// deploy.js
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath).filter(folder => folder !== '.DS_Store');

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs
    .readdirSync(folderPath)
    .filter(file => file.endsWith('.js') && file !== '.DS_Store');

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`⚠️ Kommandoen i ${filePath} mangler "data" eller "execute".`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

async function deployToGuild(guildId) {
  try {
    console.log(`🚀 Registrerer kommandoer for guild ${guildId}...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
      { body: commands }
    );
    console.log(`✅ Kommandoer registrert for guild ${guildId}`);
  } catch (error) {
    console.error(`❌ Feil ved registrering for guild ${guildId}:`, error);
  }
}

module.exports = deployToGuild;
