const mongoose = require('mongoose');

const Panelschema = new mongoose.Schema({
  Id: { type: String, required: true },
  guildId: { type: String, required: true },
  category: { type: String, required: true },
  autotrans: { type: String, required: true },
  panel: { type: String, required: true }
});

module.exports = mongoose.model('Panel', Panelschema);
