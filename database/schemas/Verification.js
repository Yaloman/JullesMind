const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  roleId: { type: String, required: true },
  channelId: { type: String, required: true }
});

module.exports = mongoose.model('Verification', verificationSchema);
