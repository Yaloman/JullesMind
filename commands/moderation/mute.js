const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user in the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to mute')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Mute duration in minutes')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for mute')
        .setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '🚫 You do not have permission to mute members.', ephemeral: true });
    }

    const user = interaction.options.getUser('target');
    const duration = interaction.options.getInteger('duration') || 10;
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    try {
      const ms = duration * 60 * 1000;
      await member.timeout(ms, reason);
      interaction.reply(`🔇 Muted ${user.tag} for ${duration} minute(s). Reason: ${reason}`);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: '❌ Failed to mute the user.', ephemeral: true });
    }
  }
};
