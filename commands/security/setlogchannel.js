const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Logs2 = require('../../database/schemas/Logs2');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlogchannel')
    .setDescription('Set the channel for logging joins/leaves/deletes')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel for logs')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: '🚫 You need Manage Server permission.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const guildId = interaction.guild.id;

    await Logs2.findOneAndUpdate(
      { guildId },
      { logChannelId: channel.id },
      { upsert: true }
    );

    interaction.reply(`📘 Log channel set to ${channel}`);
  }
};