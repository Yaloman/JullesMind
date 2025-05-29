const activeConversations = new Map(); // userId -> timeoutId

function startConversation(userId, onTimeout) {
  if (activeConversations.has(userId)) {
    clearTimeout(activeConversations.get(userId));
  }

  const timeoutId = setTimeout(() => {
    activeConversations.delete(userId);
    onTimeout();
  }, 2 * 60 * 1000); // 2 minutes

  activeConversations.set(userId, timeoutId);
}

function isInConversation(userId) {
  return activeConversations.has(userId);
}

module.exports = {
  startConversation,
  isInConversation,
};
