// server.js

const express = require('express');
const mongoose = require('mongoose');

const Bot = require('./models/Bot.js');
const Transcript = require('./models/Transcript.js');
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

app.get('/transcripts', async (req, res) => {
   const kode = req.query.file;
  if (!kode) return res.status(400).send('Ingen transcript oppgitt');

  const transcript = await Transcript.findOne({ transcriptId: kode });
  if (!transcript) return res.status(404).send('Transcript ikke funnet');

  res.setHeader('Content-Type', 'text/plain');
  res.send(transcript.content);
});

app.post('/api/bots', async (req, res) => {
  const { clientId, name, avatar, guildCount, latency, users, invite } = req.body;

  const b2 = await Bot.findOne({
    clientId: clientId
  });

  await b2.updateOne({
    clientId: clientId,
    name: name,
    avatar: avatar,
    guildCount: guildCount,
    latency: latency,
    users: users,
    invite: invite,
    lastUpdated: new Date()
  })
  console.log("b2 updated")
  return res.status(200).json({ message: 'Updated' });
});
app.post('/api/bots/register', async (req, res) => {
  const { clientId, name, avatar, guildCount, latency, users, invite } = req.body;

  const b1 = await Bot.findOne({clientId: clientId});

  if(b1) {
    console.log("b1 exists")
    b1.updateOne({
      clientId: clientId,
      name: name, 
      avatar: avatar,
      guildCount: guildCount,
      users: users,
      invite: invite,
      latency: latency,
      lastUpdated: new Date()
    })
    console.log('Bot exists and Updated');
    return res.status(200).json({ message: 'Bot exists and Updated' });
  }
console.log("b1 created, not exists")
  await Bot.create({
    clientId: clientId,
    name: name,
    avatar: avatar,
    guildCount: guildCount,
    latency: latency,
    users: users,
    invite: invite,
    lastUpdated: new Date()
  })
  console.log('Bot created and Updated');

  return res.status(200).json({ message: 'Bot created' });
});

app.listen(3001, () => {
  console.log('API running on http://localhost:3001');
});
