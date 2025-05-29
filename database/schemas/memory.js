const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  userId: String,
  content: String,
  embedding: [Number],
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Memory', memorySchema);

