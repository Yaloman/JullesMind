const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Security = require('../../database/schemas/Security');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antilink')
    .setDescription('Toggle anti-link system')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Enable or disable anti-link')
        .setRequired(true)
        .addChoices(
          { name: 'Enable', value: 'enable' },
          { name: 'Disable', value: 'disable' }
        )),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: '🚫 You need Manage Server permission.', ephemeral: true });
    }

    const action = interaction.options.getString('action');
    const guildId = interaction.guild.id;
    let settings = await Security.findOne({ guildId });

    if (!settings) {
      settings = new Security({ guildId });
    }

    settings.antiLink = action === 'enable';
    await settings.save();

    interaction.reply(`🔒 Anti-link has been **${action}d**.`);
  }
};
