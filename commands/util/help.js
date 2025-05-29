const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📖 Se en liste over alle tilgjengelige kommandoer'),

  async execute(interaction, client) {
    const categoriesPath = path.join(__dirname, '..');
    const categories = fs.readdirSync(categoriesPath).filter(folder => folder !== '.DS_Store');

    const allCommands = [];

    for (const category of categories) {
      const commandsPath = path.join(categoriesPath, category);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== '.DS_Store');

      for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data) {
          allCommands.push({
            name: `/${command.data.name}`,
            description: command.data.description || 'Ingen beskrivelse',
            category: category
          });
        }
      }
    }

    // Paginering
    const itemsPerPage = 6;
    let page = 0;
    const totalPages = Math.ceil(allCommands.length / itemsPerPage);

    const getEmbed = (pageIndex) => {
      const start = pageIndex * itemsPerPage;
      const currentCommands = allCommands.slice(start, start + itemsPerPage);

      const embed = new EmbedBuilder()
        .setTitle('📚 Hjelpemeny')
        .setDescription('Her er en liste over tilgjengelige kommandoer:\n')
        .setColor('#5865F2')
        .setFooter({ text: `Side ${pageIndex + 1} av ${totalPages}` });

      for (const cmd of currentCommands) {
        embed.addFields({
          name: `${cmd.name}`,
          value: `📁 **Kategori**: \`${cmd.category}\`\n📝 ${cmd.description}`
        });
      }

      return embed;
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setLabel('◀️ Forrige')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),

      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('Neste ▶️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(totalPages <= 1)
    );

    const message = await interaction.reply({
      embeds: [getEmbed(page)],
      components: [row],
      fetchReply: true,
      ephemeral: true
    });

    const collector = message.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 60_000
    });

    collector.on('collect', async i => {
      if (i.customId === 'next') {
        page++;
      } else if (i.customId === 'prev') {
        page--;
      }

      row.components[0].setDisabled(page === 0);
      row.components[1].setDisabled(page >= totalPages - 1);

      await i.update({
        embeds: [getEmbed(page)],
        components: [row]
      });
    });

    collector.on('end', async () => {
      try {
        await message.edit({ components: [] });
      } catch (err) {
        console.log('❗ Kunne ikke deaktivere knappene:', err.message);
      }
    });
  }
};
