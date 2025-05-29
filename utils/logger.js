// utils/logger.js
const fs = require('fs');
const path = require('path');

function logEvent(eventType, data) {
  const logPath = path.join(__dirname, '..', 'logs', `${eventType}.log`);
  const entry = `[${new Date().toISOString()}] ${JSON.stringify(data)}\n`;
  fs.appendFileSync(logPath, entry);
}

module.exports = logEvent;
