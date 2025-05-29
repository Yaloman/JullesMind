const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('View the current music queue'),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guild);
    if (!queue) return interaction.reply('❌ No songs in queue.');

    const q = queue.songs.map((song, i) => `${i + 1}. ${song.name} \`[${song.formattedDuration}]\``).join('\n');
    interaction.reply(`🎵 **Queue:**\n${q}`);
  }
};