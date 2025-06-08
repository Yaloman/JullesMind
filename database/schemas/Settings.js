// database/schemas/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  admins: { type: [String], default: [] },
  moderators: { type: [String], default: [] },
  language: { type: String, default: 'en' },
  verify: {type: Boolean, default: false},
  verify_nrole: {type: String, default: null},
  verify_role: {type: String, default: null},
  emailverify: {type: Boolean, default: true},
  email: {type: String, default: 'bot@dev.croove.me'},
  verificationChannelId: {type: String, default: null},

});

module.exports = mongoose.model('Settings', settingsSchema);
