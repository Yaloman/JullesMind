const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Settings = require('../../database/schemas/Settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Initial bot setup')
    .addStringOption(option =>
      option.setName('prefix')
        .setDescription('Command prefix')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('admin')
        .setDescription('Admin role')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('moderator')
        .setDescription('Moderator role')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '🚫 Admin only.', ephemeral: true });
    }

    const prefix = interaction.options.getString('prefix');
    const admin = interaction.options.getRole('admin');
    const mod = interaction.options.getRole('moderator');

    await Settings.findOneAndUpdate(
      { guildId: interaction.guild.id },
      {
        prefix,
        admins: [admin.id],
        moderators: [mod.id]
      },
      { upsert: true }
    );

    interaction.reply(`✅ Setup complete! Prefix: \`${prefix}\`, Admin: ${admin.name}, Mod: ${mod.name}`);
  }
};
