const logsSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  command: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Logs', logsSchema);