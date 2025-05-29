const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout (unmute) from a user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to unmute')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '🚫 You do not have permission to unmute members.', ephemeral: true });
    }

    const user = interaction.options.getUser('target');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    try {
      await member.timeout(null);
      interaction.reply(`🔊 ${user.tag} has been unmuted.`);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: '❌ Failed to unmute the user.', ephemeral: true });
    }
  }
};
