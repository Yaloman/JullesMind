const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dash')
    .setDescription('Åpner kontrollpanelet for denne serveren'),

  async execute(interaction) {
    const guildId = interaction.guildId;
    const baseUrl = process.env.DASHBOARD_URL;

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('⚙️ Active Bots')
        .setStyle(ButtonStyle.Link)
        .setURL(`${baseUrl}/bots`),
      new ButtonBuilder()
        .setLabel('📄 Settings (coming soon)')
        .setStyle(ButtonStyle.Link)
        .setURL(`${baseUrl}/queue`)
        .setDisabled()
    );

    await interaction.reply({
      content: `🛠️ Klikk på en knapp for å åpne en del av dashboardet for denne serveren.`,
      components: [row1, row2, row3],
      ephemeral: true
    });
  }
};
