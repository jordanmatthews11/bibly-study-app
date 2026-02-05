import { ESV_BOOKS } from '../services/esvApi'
import BookList from '../components/BookList'

export default function Bible() {
  const books = ESV_BOOKS

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <aside className="hidden w-64 shrink-0 border-r border-stone-200 bg-white p-4 dark:border-stone-700 dark:bg-stone-900 md:block">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
          Books
        </h2>
        <BookList books={books} />
      </aside>
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Bible
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Choose a book from the sidebar, or open a chapter directly from search or
            character profiles.
          </p>
          <div className="mt-6 md:hidden">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Books
            </h2>
            <BookList books={books} />
          </div>
        </div>
      </div>
    </div>
  )
}
