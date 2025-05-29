const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('▶️ Gjenoppta avspilling'),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) return interaction.reply({ content: '🚫 Ingen musikk spilles.', ephemeral: true });

    queue.resume();
    interaction.reply('▶️ Avspilling gjenopptatt.');
  }
};
