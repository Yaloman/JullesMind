const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  id: String,
  url: String,
  proxyURL: String,
  name: String,
  contentType: String,
  size: Number,
});

const embedFieldSchema = new mongoose.Schema({
  name: String,
  value: String,
  inline: Boolean,
});

const embedSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  color: Number,
  footer: {
    text: String,
    iconURL: String,
  },
  image: {
    url: String,
  },
  thumbnail: {
    url: String,
  },
  author: {
    name: String,
    url: String,
    iconURL: String,
  },
  fields: [embedFieldSchema],
});

const messageSchema = new mongoose.Schema({
  id: String,
  authorId: String,
  authorTag: String,
  authorAvatarURL: String,
  content: String,
  timestamp: Date,
  attachments: [attachmentSchema],
  embeds: [embedSchema],
});

const transcriptSchema = new mongoose.Schema({
  transcriptId: { type: String, required: true, unique: true }, // public link id
  ticketId: { type: String, required: true },                   // internal ticket ref
  userId: { type: String, required: true },                     // who opened the ticket
  channelId: { type: String, required: true },
  guildName: { type: String },
  messages: [messageSchema],                                    // raw messages (optional)
  html: { type: String },                                       // rendered HTML transcript
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transcript', transcriptSchema);
``
