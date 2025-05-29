const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('🛑 Stopper musikken, tømmer køen og forlater voice-kanalen'),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue) {
      return interaction.reply({
        content: '🚫 Ingen musikk å stoppe.',
        ephemeral: true
      });
    }

    try {
      await queue.stop(); // Stopper musikken og tømmer køen
      if (queue.voice && queue.voice.connection) {
        queue.voice.connection.disconnect(); // Forlater voice-kanalen
      }
      interaction.reply('🛑 Musikk stoppet, køen tømt og boten har forlatt voice-kanalen.');
     


    } catch (error) {
      console.error('Feil ved stopping:', error);
      interaction.reply({
        content: '❌ Noe gikk galt da jeg prøvde å stoppe musikken.',
        ephemeral: true
      });
    }
  }
};
