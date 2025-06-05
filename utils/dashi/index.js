const axios = require('axios');

class Dashi {
  constructor({ apiUrl, token }) {
    this.apiUrl = apiUrl;
    this.token = token;
    this.guildCountFn = null;
    this.clientId = null;
    this.interval = null;
    this.latency = null;
  }

  register(botInfo) {
    this.clientId = botInfo.clientId;

    return axios.post(`${this.apiUrl}/api/bots/register`, botInfo, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }).then(() => {
      console.log('[Dashi] Bot registered successfully');
    }).catch(err => {
      console.error('[Dashi:ERROR] Register error:', err.message);
    });
  }

  sendUpdate(getStatsFn) {
    this.interval = setInterval(async () => {
      try {
        const stats = await getStatsFn();
        await axios.post(`${this.apiUrl}/api/bots`, stats, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        console.log('[Dashi] Sent update to dashboard');
      } catch (err) {
        console.error('[Dashi:ERROR] Failed to send update:', err.message);
      }
    }, 5000); // every 20 seconds
  }

  stopUpdates() {
    if (this.interval) clearInterval(this.interval);
  }
}

module.exports = Dashi;
