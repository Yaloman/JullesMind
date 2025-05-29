const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Settings = require('../../database/schemas/Settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Change bot command prefix')
    .addStringOption(option =>
      option.setName('prefix')
        .setDescription('New prefix')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: '🚫 You need Manage Server permission.', ephemeral: true });
    }

    const prefix = interaction.options.getString('prefix');
    await Settings.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { prefix },
      { upsert: true }
    );

    interaction.reply(`✅ Prefix changed to \`${prefix}\``);
  }
};
