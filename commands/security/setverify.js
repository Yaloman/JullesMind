const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Verification = require('../../database/schemas/Verification');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setverify')
    .setDescription('Set verification role and channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Verification channel')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to give upon verification')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '🚫 You need Manage Roles permission.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    await Verification.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { channelId: channel.id, roleId: role.id },
      { upsert: true }
    );

    interaction.reply(`✅ Verification set! Channel: ${channel}, Role: ${role}`);
  }
};
