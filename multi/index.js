// dashboard/api/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Models
const Bot = require('./models/Bot');

// Routes
app.post('/api/bots/register', async (req, res) => {
  const { clientId, username, avatar, inviteUrl } = req.body;

  try {
    let bot = await Bot.findOneAndUpdate(
      { clientId },
      { username, avatar, inviteUrl },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Bot registered', bot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/bots/update/:clientId', async (req, res) => {
  const { clientId } = req.params;
  const stats = req.body;

  try {
    const bot = await Bot.findOneAndUpdate(
      { clientId },
      { stats, lastUpdated: new Date() },
      { new: true }
    );

    if (!bot) return res.status(404).json({ message: 'Bot not found' });
    res.status(200).json({ message: 'Stats updated', bot });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Dashboard API running on port ${PORT}`));