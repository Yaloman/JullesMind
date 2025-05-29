const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust playback volume')
    .addIntegerOption(option =>
      option.setName('percent')
        .setDescription('Volume percentage (1-100)')
        .setRequired(true)),
  async execute(interaction, client) {
    const vol = interaction.options.getInteger('percent');
    if (vol < 1 || vol > 100) return interaction.reply('🔉 Volume must be between 1 and 100.');

    try {
      client.distube.setVolume(interaction.guild.id, vol);
      interaction.reply(`🔊 Volume set to ${vol}%`);
    } catch (err) {
      console.error(err);
      interaction.reply('❌ Could not set volume.');
    }
  }
};