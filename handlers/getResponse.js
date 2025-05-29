const Memory = require('../database/schemas/memory');
const getEmbedding = require('../utils/embedding');
const findClosestMemories = require('../utils/similarity');
const axios = require('axios');

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

async function getBotReply(userId, userMessage) {
  const queryEmbedding = await getEmbedding(userMessage);
  const allMemories = await Memory.find({ userId });
  const relevantMemories = findClosestMemories(queryEmbedding, allMemories);

  const memoryContext = relevantMemories.map(m => `User once said: "${m.content}"`).join('\n');
  const prompt = `${memoryContext}\nUser says: "${userMessage}"\nRespond as a helpful bot.`;

  const response = await axios.post(
    'https://api.together.xyz/v1/chat/completions',
    {
      model: 'meta-llama/Llama-3-70b-chat-hf',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = getBotReply;
