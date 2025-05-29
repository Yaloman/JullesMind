const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('▶️ Spill av en sang fra YouTube, Spotify eller annen støttet plattform')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Sangen du vil spille')
        .setRequired(true)),

  async execute(interaction, client) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: '🚫 Du må være i en voice-kanal!',
        ephemeral: true
      });
    }

    try {
      await interaction.deferReply(); // 👈 Viktig for å forhindre "Unknown interaction"

      await client.distube.play(voiceChannel, query, {
        member: interaction.member,
        textChannel: interaction.channel,
        interaction
      });

      await interaction.editReply(`🎶 Søker og spiller: \`${query}\``); // 👈 Bruk editReply
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content: '❌ Kunne ikke spille sangen.',
      });
    }
  }
};
