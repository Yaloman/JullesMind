// app/page.jsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Bot Dashboard</h1>
      <p><Link href="/bots">View Registered Bots →</Link></p>
    </div>
  );
}
