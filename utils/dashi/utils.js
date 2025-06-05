function logInfo(...args) {
  console.log("[Dashi]", ...args);
}

function logError(...args) {
  console.error("[Dashi:ERROR]", ...args);
}

module.exports = { logInfo, logError };
