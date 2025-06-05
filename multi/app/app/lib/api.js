// lib/api.js
export async function fetchBots() {
  const res = await fetch('https://api.croove.me/api/bots');
  if (!res.ok) {
    throw new Error('Failed to fetch bots');
  }
  return res.json();
}
