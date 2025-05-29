const { SlashCommandBuilder } = require('discord.js');
const Warning = require('../../database/schemas/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for warning')
        .setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason');

    if (!interaction.member.permissions.has('ModerateMembers')) {
      return interaction.reply({ content: '🚫 You don’t have permission to warn members.', ephemeral: true });
    }

    let record = await Warning.findOne({ guildId: interaction.guild.id, userId: target.id });
    if (!record) {
      record = new Warning({ guildId: interaction.guild.id, userId: target.id, warnings: [] });
    }

    record.warnings.push({
      moderatorId: interaction.user.id,
      reason
    });

    await record.save();

    interaction.reply(`⚠️ Warned ${target.tag} for: ${reason}`);
  }
};
