// app/bots/page.jsx
'use client';

import { useEffect, useState } from 'react';
import BotCard from '../components/BotCard';
import { fetchBots } from '../lib/api';

export default function BotsPage() {
  const [bots, setBots] = useState([]);

  useEffect(() => {
    async function fetchBots() {
      const res = await fetch('http://localhost:3001/api/bots'); // adjust port if needed
      const data = await res.json();
      setBots(data.bots);
    }

    fetchBots();
  }, []);

  return (
    <div>
      <h2>Registered Bots</h2>
      {bots.length === 0 ? (
        <p>No bots registered.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {bots.map((bot) => (
            <BotCard key={bot.clientId} bot={bot} />
          ))}
        </div>
      )}
    </div>
  );
}
