import Link from 'next/link';
export default function BotCard({ bot }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>{bot.name}</h3>
      <p><strong>ID:</strong> {bot.clientId}</p>
      <p><strong>Guilds:</strong> {bot.guildCount}</p>
      <p><strong>Users:</strong> {bot.users} </p>
      <p><strong>Latency:</strong> {bot.latency} ms</p>
      <p><strong>Last Update:</strong> {new Date(bot.lastUpdated).toLocaleString()}</p>
      <p><strong>Invite:</strong> <Link href={bot.invite}>Click here</Link></p>
      {bot.avatar && <img src={bot.avatar} alt="Bot avatar" style={{ width: 64, borderRadius: '50%' }} />}
    </div>
  );
}
