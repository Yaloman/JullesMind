const express = require('express');
const mongoose = require('mongoose');
const Logs2 = require('../../database/schemas/Logs2');
const Logs = require('../../database/schemas/Logs'); 
const memory = require('../../database/schemas/memory');
const Security = require('../../database/schemas/Security');
const Settings = require('../../database/schemas/Settings');
const User = require('../../database/schemas/User');
const Verify = require('../../database/schemas/Verification');
const Warnings = require('../../database/schemas/Warnings');
const api = express();
api.use(express.json());

// Simple Auth Middleware (optional)
api.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.DASH_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// GET log channel for a guild
api.get('/logchannel/:guildId', async (req, res) => {
  try {
    const log = await Logs2.findOne({ guildId: req.params.guildId });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch log channel' });
  }
});

// POST set log channel
api.post('/logchannel/:guildId', async (req, res) => {
  try {
    const { logChannelId } = req.body;
    const updated = await Logs2.findOneAndUpdate(
      { guildId: req.params.guildId },
      { logChannelId },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update log channel' });
  }
});

module.exports = api;
