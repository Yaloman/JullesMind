const cosineSimilarity = require('compute-cosine-similarity');
function findClosestMemories(queryEmbedding, allMemories, topN = 3) {
  return allMemories
    .filter(m => Array.isArray(m.embedding) && m.embedding.length === queryEmbedding.length)
    .map(m => ({
      ...m._doc,
      similarity: cosineSimilarity(queryEmbedding, m.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
}

module.exports = findClosestMemories;
