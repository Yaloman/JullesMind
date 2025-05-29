const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('Toggle repeat mode')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('off, song, or queue')
        .setRequired(true)
        .addChoices(
          { name: 'off', value: '0' },
          { name: 'song', value: '1' },
          { name: 'queue', value: '2' }
        )),
  async execute(interaction, client) {
    const mode = parseInt(interaction.options.getString('mode'));

    try {
      const repeatMode = client.distube.setRepeatMode(interaction.guild.id, mode);
      const modeText = ['Off', 'Repeat Song', 'Repeat Queue'];
      interaction.reply(`🔁 Repeat mode set to **${modeText[repeatMode]}**`);
    } catch (err) {
      console.error(err);
      interaction.reply('❌ Could not change repeat mode.');
    }
  }
};