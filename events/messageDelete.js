const Logs2 = require('../database/schemas/Logs2');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (!message.guild || message.author.bot) return;
    const logData = await Logs2.findOne({ guildId: message.guild.id });
    if (!logData) return;

    const logChannel = message.guild.channels.cache.get(logData.logChannelId);
    if (logChannel) {
      logChannel.send(`🗑️ Message deleted from ${message.author.tag}: \n> ${message.content}`);
    }
  }
};
