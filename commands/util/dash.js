const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dash')
    .setDescription('Åpner kontrollpanelet for denne serveren'),

  async execute(interaction) {
    const guildId = interaction.guildId;
    const baseUrl = `http://localhost:3000/${guildId}`;

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('⚙️ Innstillinger')
        .setStyle(ButtonStyle.Link)
        .setURL(`${baseUrl}/settings`),
      new ButtonBuilder()
        .setLabel('📄 Kø')
        .setStyle(ButtonStyle.Link)
        .setURL(`${baseUrl}/queue`)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🧾 Logger')
        .setStyle(ButtonStyle.Link)
        .setURL(`${baseUrl}/logs`),
      new ButtonBuilder()
        .setLabel('🎧 Avspilling')
        .setStyle(ButtonStyle.Link)
        .setURL(`${baseUrl}/playback`)
    );

    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('👥 Medlemmer')
        .setStyle(ButtonStyle.Link)
        .setURL(`${baseUrl}/members`)
    );

    await interaction.reply({
      content: `🛠️ Klikk på en knapp for å åpne en del av dashboardet for denne serveren.`,
      components: [row1, row2, row3],
      ephemeral: true
    });
  }
};
