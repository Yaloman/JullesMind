const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Settings = require('../../database/schemas/Settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setmod')
    .setDescription('Set moderator role(s)')
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Moderator role')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '🚫 Admins only.', ephemeral: true });
    }

    const role = interaction.options.getRole('role');

    await Settings.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { $addToSet: { moderators: role.id } },
      { upsert: true }
    );

    interaction.reply(`🧰 Added ${role.name} as a moderator role.`);
  }
};
