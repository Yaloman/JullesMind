const { SlashCommandBuilder } = require('discord.js');
const Settings = require('../../database/schemas/Settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('showsettings')
    .setDescription('Show current bot configuration'),
  async execute(interaction) {
    const config = await Settings.findOne({ guildId: interaction.guild.id });

    if (!config) {
      return interaction.reply('⚙️ No settings configured for this server yet.');
    }

    const adminRoles = config.admins.map(id => `<@&${id}>`).join(', ') || 'None';
    const modRoles = config.moderators.map(id => `<@&${id}>`).join(', ') || 'None';
    const language = config.language;
    const verify1 = config.verify;
    const verify = 'Disabled';
    if(verify) verify = 'Enabled';
    const email = config.email;
    

    interaction.reply({
      content: `📋 **Bot Settings:**
**Prefix**: \`${config.prefix}\`
**Admins**: ${adminRoles}
**Moderators**: ${modRoles}
**Language**: ${config.language}
**Verification Module**: ${verify}
**Default Email used**: ${email}`,
      ephemeral: true
    });
  }
};
