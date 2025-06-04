// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <header style={{ padding: '1rem', background: '#1e1e2f', color: '#fff' }}>
          <h2>JullesMind Dashboard</h2>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
      </body>
    </html>
  );
}
