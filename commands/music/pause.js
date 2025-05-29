const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('⏸️ Pauser den nåværende sangen'),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    
    if (!queue) return interaction.reply({ content: '🚫 Ingen musikk spilles.', ephemeral: true });

    queue.pause();
    interaction.reply('⏸️ Musikk pauset.');
  }
};
