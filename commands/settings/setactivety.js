const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Settings = require('../../database/schemas/Settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setactivety')
    .setDescription('Changing activety for the bot')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text for the display')
        .setRequired(true))
        .addNumberOption(option =>
      option.setName('type')
        .setDescription('type')
        .setRequired(true)
        .addChoices(
          { name: 'Custom', value: 4},
          { name: 'Competing', value: 5},
          { name: 'Listening', value: 2},
          { name: 'Playing', value: 0},
          { name: 'Streaming', value: 1},
          { name: 'Watching', value: 3}
          
        ))
    .addStringOption(option =>
      option.setName('state')
        .setDescription('State')
        .setRequired(false))
        .addStringOption(option =>
      option.setName('url')
        .setDescription('Url')
        .setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '🚫 Admin only.', ephemeral: true });
    }

    const text = interaction.options.getString('text');
    const type = interaction.options.getNumber('type');
    const state = interaction.options.getString('state');
    const url = interaction.options.getString('url');
 

    await interaction.client.user.setActivity(text, { type: type, state: state, url: url });

    

    interaction.reply(`✅ Activety set complete! Text: \`${text}\`, type: ${type}, State: ${state}, Url: ${url}`);
  }
};
