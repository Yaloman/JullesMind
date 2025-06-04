// server.js

const express = require('express');
const mongoose = require('mongoose');
const Bot = require('./models/Bot.js');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/api/bots', async (req, res) => {
  const bots = await Bot.find({});
  
  res.json({ bots });
});

app.post('/api/bots', async (req, res) => {
  const { clientId, name, avatar, guildCount, latency, users } = req.body;
  await Bot.findOneAndUpdate(
    { clientId },
    { name, avatar, guildCount, latency, lastUpdated: new Date(), users: users },
    { upsert: true }
  );
  res.status(200).json({ message: 'Updated' });
});

app.listen(3001, () => {
  console.log('API running on http://localhost:3001');
});
