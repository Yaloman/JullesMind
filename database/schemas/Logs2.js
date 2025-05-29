const mongoose = require('mongoose');

const logsSchema2 = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  logChannelId: { type: String, required: true }
});

module.exports = mongoose.model('Logs2', logsSchema2);