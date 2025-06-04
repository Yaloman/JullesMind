const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  Id: { type: String, required: true },
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'open' },
  transcript: { type: String, required: false },
  panel: { type: String, required: false }
});

module.exports = mongoose.model('Ticket', ticketSchema);
