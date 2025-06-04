// models/Bot.js
const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  name: String,
  avatar: String,
  guildCount: Number,
  latency: Number,
  invite: String,
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bot', botSchema);
