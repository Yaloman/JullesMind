const mongoose = require('mongoose');

const securitySchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  antiLink: { type: Boolean, default: false },
  antiSpam: { type: Boolean, default: false }
});

module.exports = mongoose.model('Security', securitySchema);
