const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  avatar: String
});

module.exports = mongoose.model('User', userSchema);
