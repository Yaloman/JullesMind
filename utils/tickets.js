// utils/logger.js
const fs = require('fs');
const path = require('path');
const Logs2 = require('../database/schemas/Logs2');
const randomId = require('random-id');
const logChannelCache = new Map(); // guildId -> channel
const Ticket = require('../database/schemas/Ticket');
const Panel = require('../database/schemas/Panel');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const rId = require ('random-id');

async function close(client, interaction) {
  const ticket = await Ticket.findOne({ channelId: interaction.channel.id, status: 'open' });
    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket not found or already closed.', ephemeral: true });
    }

    
    


   const close_panel = new EmbedBuilder()
   .setColor('DarkRed').setDescription('🔒 This ticket is Closed ')
.setFooter( {
    text: `Croove - Ticket #${ticket.Id}`
})

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('delete_ticket')
    .setLabel('Close Ticket')
    .setStyle(ButtonStyle.Danger),

  new ButtonBuilder()
    .setCustomId('trans_ticket')
    .setLabel('Transcript')
    .setStyle(ButtonStyle.Secondary),

  new ButtonBuilder()
    .setCustomId('reopen_ticket')
    .setLabel('Reopen Ticket')
    .setStyle(ButtonStyle.Success)
);

await interaction.channel.send({
    embeds: [close_panel],
    components: [row]
})




return await Ticket.findByIdAndUpdate(ticket._id, { status: 'closed' });
   
   // {}
   
    //setTimeout(() => {
      //interaction.channel.delete().catch(console.error);
    //}, 5000);
}

async function del(client, interaction) {
  const ticket = await Ticket.findOne({ channelId: interaction.channel.id, status: 'closed' });
    if (!ticket) {
      return interaction.reply({ content: '❌ Ticket not found.', ephemeral: true });
    }

    
    

   



await interaction.channel.send('🔒 This ticket is Closing in 5 seconds')


 await Ticket.findByIdAndUpdate(ticket._id, { status: 'deleted' })

return await setTimeout(() => {
    interaction.channel.delete().catch(console.error);
    }, 5000);
   
   // {}

}


async function create(client, interaction, mes) {
  

console.log(mes)

const panel = await Panel.findOne({panel: mes})
 console.log(panel)



    
    
const supportRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase().includes('support'));
    if (!supportRole) {
      return interaction.reply({
        content: '⚠️ No role named `support` found in this server.',
        ephemeral: true
      });
    }
    const cat = await interaction.guild.channels.fetch(panel.category);
    console.log(cat)
const Id = await rId(6, 'A20')
console.log(panel.category)
    const channel = await interaction.guild.channels.create({
      name: `ticket-${Id}`,
      type: ChannelType.GuildText,
      parent: cat,
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
      channelId: channel.id,
      panel: panel.Id
    });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
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
   
   // {}

}

module.exports = {
  close,
  del,
  create
};
