const axios = require('axios');

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

async function getEmbedding(text) {
  const response = await axios.post(
    'https://api.together.xyz/v1/embeddings',
    {
      model: 'togethercomputer/m2-bert-80M-32k-retrieval',
      input: text
    },
    {
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data[0].embedding;
}

module.exports = getEmbedding;
