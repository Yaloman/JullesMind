# 🎧 JullesMind → Croove → Crooooovy

**Croove** is a multifunctional Discord bot project that began as a personal side project just 1–2 weeks ago. Since then, I've added various modules, a basic dashboard (I know it's not great yet 😅), and an API system. It's currently a hobby project, but my plan is to polish and complete all features to officially release it under the name **Croove**.

Feel free to fork and explore the repo — just keep in mind there may still be some bugs or unfinished areas. I'm actively fixing and improving things as I go. Thanks for checking it out!

---

## 🚀 About Me

I'm a full-stack developer passionate about building powerful, community-driven tools like this bot. Always learning, always shipping.

---

## ⚙️ Features

### 🤖 Discord Bot

- 🎟️ **Ticket System** – Panel, Create, Delete, Reopen, Transcript, Setup  
- 🔨 **Moderation** – Ban, Kick, Mute, Warn  
- 🛡️ **Security** – Anti-link, Anti-spam  
- ✅ **Verification** – Email or Discord OAuth verification panel  
- 🎵 **Music** – Play, Stop, Resume, Pause, Queue  
- 🔧 **Settings** – Setup, Logging, Admin/Mod roles, Activity, Prefix config  
- 🧠 **AI** – Integrated chat using [Together.ai](https://www.together.ai)  
- 🔍 **Utility** – Help, Dashboard link  

### 🌐 Dashboard

- 🏠 **Homepage** – Placeholder for future content  
- 🤖 **Bots** – View active bots and metadata  
- 📩 **Verification Module** – Dashboard form for email verification with OTP code  

### 🔌 API

The bot uses an internal API that serves the dashboard and some bot functions:

- `GET /Transcript` – Retrieve saved ticket transcripts  
- `GET /api/bots` – Get all active bots  
- `POST /verify-code` – Check if OTP code is valid  
- `POST /api/bots` – Update bot activity  
- `POST /api/bots/register` – Initial bot registration  

---

## 📄 Documentation

Documentation coming soon: [https://docs.croove.me](https://docs.croove.me)

---

## 🔑 API Keys

You’ll need a Together.ai API key: [https://www.together.ai](https://www.together.ai)

---

## 🚀 Deployment

First clone this repo

```bash
  git clone https://github.com/Yaloman/JullesMind.git
```

Start with installation of all needed packages

```bash
  npm i
```

Change .env.example to .env and fill out every .env

```bash
BOT_TOKEN=
MONGO_URI=
PORT=3000
CLIENT_ID=
GUILD_ID=
CLIENT_SECRET=
DASHBOARD_URL=http://localhost:3000 // or change to domain
SESSION_SECRET=
TOGETHER_API_KEY=
dash=true
api=http://localhost:3001 // or change to api domain
VERIFICATION_CHANNEL_ID=
NEW_ROLE_ID=
VERIFIED_ROLE_ID=
```

Install pm2

```bash
  npm i pm2 -g
```

To deploy this project run

```bash
  pm2 start src/index.js --name bot
```

Now your finito and can start 

The bot will be able to operate without Dashboard / API, but certain commands will return error or not function

To get the whole experience visit these to repositorys.

(Dashboard)(https://github.com/Yaloman/nextjs-dash)
(API)(https://github.com/Yaloman/Api)

## 🛠 Skills
Javascript, HTML, CSS...


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


I can also be contacted at info@croove.me.


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@Yaloman](https://www.github.com/Yaloman)

