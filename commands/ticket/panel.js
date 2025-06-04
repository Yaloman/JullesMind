const { SlashCommandBuilder, ChannelType, PermissionFlagsBits,  } = require('discord.js');
const Ticket = require('../../database/schemas/Ticket');
const Panel = require('../../database/schemas/Panel')
const rId = require('random-id');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('create a panel for tickets')
    .addStringOption(option =>
      option.setName('title').setDescription('Embed title').setRequired(true))
    .addStringOption(option =>
      option.setName('description').setDescription('Embed description').setRequired(true))
    .addStringOption(option =>
      option.setName('category').setDescription('Category for the tickets to be created in (paste the Id)').setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to post panel')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .addChannelOption(option =>
      option.setName('logchannel')
        .setDescription('LogChannel to post transcript if enabled')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .addBooleanOption(option =>
        option.setName("transcript")
        .setDescription("True/False for auto transcription")
        .setRequired(true)
    ),

  async execute(interaction) {
    
   const supportRoleName = 'support';

// Check if user has the support role
if (!interaction.member.roles.cache.some(role => role.name === supportRoleName)) {
  return interaction.reply({ content: `❌ You need the **${supportRoleName}** role to use this command.`, ephemeral: true });
}
const Id2 = await rId(6, '0')
const Id = Number(Id2);

const title = interaction.options.getString('title');
const description = interaction.options.getString('description');
const targetChannel = interaction.options.getChannel('channel');
const logChannel = interaction.options.getChannel('logchannel');
const category = interaction.options.getString('category');
const trans = interaction.options.getBoolean('transcript');

const embed = new EmbedBuilder()
  .setTitle(title)
  .setDescription(description)
  .setFooter({
    text: `Croove - Made by Mr. Croove`
  })
  .setColor(0x2f3136);

const button = new ButtonBuilder()
.setId(Id)
  .setCustomId('create_ticket')
  .setLabel('🎫 Create a Ticket')
  .setStyle(ButtonStyle.Primary);

const row = new ActionRowBuilder().addComponents(button);

const message = await targetChannel.send({ embeds: [embed], components: [row] });
console.log(Id)
await Panel.create({
  Id: Id,
  title: title,
  guildId: interaction.guild.id,
  category: category,
  autotrans: trans,
  panel: message.id
})

return await interaction.reply({ content: `✅ Ticket panel sent to ${targetChannel}`, ephemeral: true });

  }
};
