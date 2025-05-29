// database/schemas/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  admins: { type: [String], default: [] },
  moderators: { type: [String], default: [] },
  language: { type: String, default: 'en' }
});

module.exports = mongoose.model('Settings', settingsSchema);
