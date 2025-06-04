const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Ticket = require('../../database/schemas/Ticket');
const rId = require('random-id')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Open a support ticket'),

  async execute(interaction) {
    
    const supportRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase().includes('support'));
    if (!supportRole) {
      return interaction.reply({
        content: '⚠️ No role named `support` found in this server.',
        ephemeral: true
      });
    }
const Id = await rId(6, 'A20')
    const channel = await interaction.guild.channels.create({
      name: `ticket-${Id}`,
      type: ChannelType.GuildText,
      parent: 1379484532214075544,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: supportRole.id,
          allow: [PermissionFlagsBits.ViewChannel]
        }
      ]
    });

    await Ticket.create({
      Id: Id,
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      channelId: channel.id
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(Id)
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      content: `🎫 Ticket for <@${interaction.user.id}>`,
      components: [row]
    });

    await interaction.reply({
      content: `✅ Ticket created: ${channel}`,
      ephemeral: true
    });
  }
};
