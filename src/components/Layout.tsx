import { useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import ChatPanel from './ChatPanel'

const nav = [
  { to: '/bible', label: 'Bible' },
  { to: '/search', label: 'Search' },
  { to: '/characters', label: 'Characters' },
  { to: '/study', label: 'Study' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/donate', label: 'Support' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-warm-bg text-warm-text">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-warm-border bg-warm-surface/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded p-2 hover:bg-warm-hover md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/bible" className="font-semibold text-warm-text">
            Bible Study
          </Link>
        </div>
        <nav className="hidden md:flex md:items-center md:gap-1">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded px-3 py-2 text-sm font-medium ${
                location.pathname.startsWith(to)
                  ? 'bg-warm-accent-subtle text-warm-accent'
                  : 'text-warm-muted hover:bg-warm-hover hover:text-warm-text'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded p-2 text-warm-muted hover:bg-warm-hover hover:text-warm-text"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <span className="text-sm font-medium text-warm-muted">ESV</span>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30 md:hidden"
          role="button"
          tabIndex={0}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-20 h-full w-64 transform border-r border-warm-border bg-warm-surface transition-transform md:static md:z-0 md:block md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-1 p-4 md:hidden">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`rounded px-3 py-2 text-sm font-medium ${
                location.pathname.startsWith(to)
                  ? 'bg-warm-accent-subtle text-warm-accent'
                  : 'text-warm-text hover:bg-warm-hover'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </aside>

      <main className="min-h-[calc(100vh-56px)]">{children}</main>
      <ChatPanel />
    </div>
  )
}
