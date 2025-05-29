const { SlashCommandBuilder } = require('discord.js');
const Verification = require('../../database/schemas/Verification');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify to get access'),
  async execute(interaction) {
    const config = await Verification.findOne({ guildId: interaction.guild.id });
    if (!config) return interaction.reply({ content: '⚠️ Verification is not set up.', ephemeral: true });

    if (interaction.channel.id !== config.channelId) {
      return interaction.reply({ content: '❌ You can only verify in the designated channel.', ephemeral: true });
    }

    const role = interaction.guild.roles.cache.get(config.roleId);
    if (!role) return interaction.reply({ content: '❌ The verification role no longer exists.', ephemeral: true });

    await interaction.member.roles.add(role);
    interaction.reply({ content: `🎉 You have been verified and given the ${role.name} role!`, ephemeral: true });
  }
};
