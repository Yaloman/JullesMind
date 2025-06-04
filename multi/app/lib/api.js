// lib/api.js
export async function fetchBots() {
  const res = await fetch('http://localhost:3001/api/bots');
  if (!res.ok) {
    throw new Error('Failed to fetch bots');
  }
  return res.json();
}
