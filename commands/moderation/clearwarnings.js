const { SlashCommandBuilder } = require('discord.js');
const Warning = require('../../database/schemas/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear all warnings for a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to clear warnings for')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers')) {
      return interaction.reply({ content: '🚫 You do not have permission to clear warnings.', ephemeral: true });
    }

    const user = interaction.options.getUser('target');

    const deleted = await Warning.findOneAndDelete({
      guildId: interaction.guild.id,
      userId: user.id
    });

    if (!deleted) {
      return interaction.reply(`✅ ${user.tag} had no warnings.`);
    }

    interaction.reply(`🧹 Cleared all warnings for ${user.tag}.`);
  }
};
