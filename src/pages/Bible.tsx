import { ESV_BOOKS } from '../services/esvApi'
import BookList from '../components/BookList'

export default function Bible() {
  const books = ESV_BOOKS

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <aside className="hidden w-64 shrink-0 border-r border-warm-border bg-warm-surface p-4 md:block">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-warm-muted">
          Books
        </h2>
        <BookList books={books} />
      </aside>
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-semibold text-warm-text">
            Bible
          </h1>
          <p className="text-warm-muted">
            Choose a book from the sidebar, or open a chapter directly from search or
            character profiles.
          </p>
          <div className="mt-6 md:hidden">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-warm-muted">
              Books
            </h2>
            <BookList books={books} />
          </div>
        </div>
      </div>
    </div>
  )
}
