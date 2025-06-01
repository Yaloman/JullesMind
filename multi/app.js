const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8080;

// In-memory storage for bots
const bots = {};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// API endpoints
app.post('/api/register-bot', (req, res) => {
  const { botId, name, guilds } = req.body;
  if (!botId || !name) {
    return res.status(400).json({ message: 'Missing botId or name' });
  }
  bots[botId] = { name, guilds, lastUpdate: new Date() };
  res.status(200).json({ message: 'Bot registered', bot: bots[botId] });
});

app.post('/api/ping', (req, res) => {
  const { botId } = req.body;
  if (!botId || !bots[botId]) {
    return res.status(400).json({ message: 'Bot not registered' });
  }
  bots[botId].lastUpdate = new Date();
  res.status(200).json({ message: 'Heartbeat received' });
});

// View route
app.get('/bots', (req, res) => {
  res.render('bots', { bots });
});

app.listen(PORT, () => {
  console.log(`Dashboard running at ${PORT}`);
});
