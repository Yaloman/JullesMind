const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(folder => !folder.startsWith('.'));

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, `../commands/${folder}`))
      .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`);
      if (command.data && typeof command.execute === 'function') {
        client.slashCommands.set(command.data.name, command);
        console.log(`📦 Loaded slash command: ${command.data.name}`);
      } else {
        console.warn(`⚠️ Command ${file} in ${folder} is missing required "data" or "execute"`);
      }
    }
  }
};