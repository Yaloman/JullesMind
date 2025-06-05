const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  transcriptId: { type: String, required: true, unique: true },
  ticketId: { type: String, required: true, unique: true },
  userId: String,
  channelId: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transcript', transcriptSchema);
