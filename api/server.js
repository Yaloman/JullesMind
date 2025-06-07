// server.js
console.log("Booting Express server...");

const express = require('express');
console.log("Booting Express server...1");
const mongoose = require('mongoose');
console.log("Booting Express server...2");
const Verification = require('./models/Verification');
console.log("Booting Express server...3");
const Bot = require('./models/Bot.js');
console.log("Booting Express server...4");
const Transcript = require('./models/Transcript.js');
console.log("Booting Express server..5.");
const cors = require('cors');
console.log("Booting Express server..6.");
require('dotenv').config();
console.log("Booting Express server..5.");
const app = express();
console.log("Booting Express server..4.");
app.use(express.json());
console.log("Booting Express server..3.");
app.use(cors());
console.log("Booting Express server..2.");
const { Resend } = require('resend');
console.log("Booting Express server..1.");
const { generateFromMessages } = require('discord-html-transcripts');
console.log("Booting Express server..2.");
const resend = new Resend(process.env.RESEND_API_KEY);
console.log("Booting Express server..3.");
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // force exit if connection fails
  });

class MockUser {
  constructor(data) {
    this.id = data.id;
    this.tag = data.tag;
    this.username = data.username || data.tag.split('#')[0];
    this.discriminator = data.discriminator || data.tag.split('#')[1];
    this.bot = data.bot || false;
  }
  displayAvatarURL() {
    // Returner URL til avatar, evt fallback
    return this.avatarURL || 'https://cdn.discordapp.com/embed/avatars/0.png';
  }
}

class MockMessage {
  constructor(data, channel) {
    this.id = data.id;
    this.author = new MockUser(data.author);
    this.createdAt = new Date(data.timestamp);
    this.content = data.content;
    this.attachments = new Map((data.attachments || []).map((att, i) => [i.toString(), att]));
    this.embeds = data.embeds || [];
    this.stickers = data.stickers || [];
    this.components = data.components || [];
    this.channel = channel;
    this.reference = null; 
    // ✅ Attach channel (with guild.roles.everyone) to the message
    // eventuelt legge til referanse til annen melding hvis du vil
  }
}
const { Collection } = require('discord.js'); // make sure this is installed

class MockGuild {
  constructor(name) {
    this.name = name;
    this.iconURL = () => null;

    const everyoneRole = {
      id: '000000000000000000',
      name: '@everyone',
      toString: () => '@everyone',
    };

    const rolesCollection = new Collection();
    rolesCollection.set(everyoneRole.id, everyoneRole);

    // Here’s the trick: assign both `.cache` and `.everyone`
    this.roles = {
      cache: rolesCollection,
      everyone: everyoneRole,
    };
  }
}

class MockChannel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name || 'ticket-channel';
    this.guild = new MockGuild(data.guildName || 'Guild Name');
    this.isDMBased = () => false;
  }
}


app.get('/api/bots', async (req, res) => {
  const bots = await Bot.find({});
  
  res.json({ bots });
});

app.post('/send-verification-email', async (req, res) => {
  const { email, discordId } = req.body;
console.log("Request for verification email received")
  if (!email || !discordId) {
    return res.status(400).json({ error: 'Missing email or Discord ID' });
  }
console.log("generating code for verification email")
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    
    await Verification.findOneAndUpdate(
      { discordId },
      { email, code, verified: false, createdAt: new Date() },
      { upsert: true }
    );

    await resend.emails.send({
      from: 'noreply@dev.croove.me',
      to: email,
      subject: 'Your Verification Code',
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });

    res.json({ message: 'Verification email sent' });
  } catch (err) {
    console.error('❌ Email/DB error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/verify-code', async (req, res) => {
  const { discordId, code } = req.body;

  if (!discordId || !code) {
    return res.status(400).json({ error: 'Missing discordId or code' });
  }

  try {
    const entry = await Verification.findOne({ discordId });

    if (!entry) {
      return res.status(404).json({ error: 'No verification attempt found' });
    }

    if (entry.verified) {
      return res.status(400).json({ error: 'Already verified' });
    }

    if (entry.code !== code) {
      return res.status(401).json({ error: 'Invalid verification code' });
    }

    entry.verified = true;
    await entry.save();

    res.json({ message: '✅ Verification successful' });
  } catch (err) {
    console.error('❌ Verification failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const { TextChannel } = require('discord.js');

app.get('/transcripts', async (req, res) => {
  try {
    const kode = req.query.file;
    if (!kode) {
      return res.status(400).send('Missing kode parameter');
    }

    const transcript = await Transcript.findOne({ transcriptId: kode });

    if (!transcript || !transcript.html) {
      return res.status(404).send('Transcript not found');
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(transcript.html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${process.env.PORT}`);
});
