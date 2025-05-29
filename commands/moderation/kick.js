const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for kick')
        .setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '🚫 You do not have permission to kick members.', ephemeral: true });
    }

    const user = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(user.id);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!member) {
      return interaction.reply('❌ Could not find the user in this server.');
    }

    try {
      await member.kick(reason);
      interaction.reply(`👢 Kicked ${user.tag} | Reason: ${reason}`);
    } catch (error) {
      console.error(error);
      interaction.reply('❌ Failed to kick the user.');
    }
  }
};
