const { SlashCommandBuilder } = require('discord.js');
const Warning = require('../../database/schemas/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to check')
        .setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const record = await Warning.findOne({ guildId: interaction.guild.id, userId: target.id });

    if (!record || record.warnings.length === 0) {
      return interaction.reply(`✅ ${target.tag} has no warnings.`);
    }

    const warnList = record.warnings.map((warn, i) =>
      `${i + 1}. Moderator <@${warn.moderatorId}> - ${warn.reason} (${new Date(warn.date).toLocaleDateString()})`
    ).join('\n');

    interaction.reply(`⚠️ Warnings for ${target.tag}:\n${warnList}`);
  }
};
