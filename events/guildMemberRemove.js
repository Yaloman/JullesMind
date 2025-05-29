const Logs2 = require('../database/schemas/Logs2');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const logData = await Logs2.findOne({ guildId: member.guild.id });
    if (!logData) return;

    const logChannel = member.guild.channels.cache.get(logData.logChannelId);
    if (logChannel) {
      logChannel.send(`❌ **${member.user.tag}** left the server.`);
    }
  }
};
