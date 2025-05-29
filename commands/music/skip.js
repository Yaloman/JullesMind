const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('⏭️ Hopper til neste sang i køen'),
  async execute(interaction, client) {
    const queue = client.distube.getQueue(interaction.guildId);
    if (!queue || queue.songs.length < 2)
      return interaction.reply({ content: '🚫 Ingen neste sang å hoppe til.', ephemeral: true });

    queue.skip();
    interaction.reply('⏭️ Hoppet til neste sang.');
    

  }
};
