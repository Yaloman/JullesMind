const Memory = require('../database/schemas/memory');
const getEmbedding = require('../utils/embedding');

async function saveMessage(userId, content) {
  const embedding = await getEmbedding(content);
  const memory = new Memory({ userId, content, embedding });
  await memory.save();
}

module.exports = saveMessage;
