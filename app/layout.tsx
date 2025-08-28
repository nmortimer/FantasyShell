import './globals.css'
import type { Metadata } from 'next'
import { inter, bebas, oswald } from './fonts'

export const metadata: Metadata = {
  title: 'Fantasy Content Studio',
  description: 'Retro-trading-card inspired fantasy league content builder',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${oswald.variable} dark`}>
      <body className="min-h-screen bg-bg text-text">
        <header className="sticky top-0 z-20 border-b border-neutral-800 bg-bg/90 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="text-xl font-bold tracking-wide">
              <span className="text-gold">★</span> Fantasy Content <span className="text-neon">Studio</span>
            </div>
            <nav className="text-sm space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/dashboard?leagueId=12345" className="hover:underline">Dashboard</a>
              <a href="/content" className="hover:underline">Content</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-neutral-800">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-400">
            Built for hype. © 2025
          </div>
        </footer>
      </body>
    </html>
  )
}
