const axios = require("axios");
const { logInfo, logError } = require("./utils");

class Dashi {
  constructor({ botId, name, dashboardUrl, guildCountFn }) {
    this.botId = botId;
    this.name = name;
    this.dashboardUrl = dashboardUrl;
    this.guildCountFn = guildCountFn;

    this._heartbeatInterval = null;
  }

  async register() {
    try {

      const guilds = this.guildCountFn();
      const res = await axios.post(`${this.dashboardUrl}/api/register-bot`, {
        botId: this.botId,
        name: this.name,
        guilds,
      });
      logInfo("Bot registered:", res.data);
    } catch (err) {
      logError("Register error:", err.response?.data || err.message);
    }
  }

  startHeartbeat(interval = 5000) {
    this._heartbeatInterval = setInterval(async () => {
      try {
        await axios.post(`${this.dashboardUrl}/api/ping`, {
          botId: this.botId,
        });
        logInfo("Heartbeat sent");
      } catch (err) {
        logError("Heartbeat error:", err.response?.data || err.message);
      }
    }, interval);
  }

  stopHeartbeat() {
    clearInterval(this._heartbeatInterval);
  }
}

module.exports = Dashi;
