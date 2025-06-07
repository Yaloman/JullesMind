// app/layout.jsx

import AuthProvider from "./providers/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <header style={{ padding: '1rem', background: '#1e1e2f', color: '#fff' }}>
            <h2>JullesMind Dashboard</h2>
          </header>
          <main style={{ padding: '2rem' }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
