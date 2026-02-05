import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVerseSearch } from '../hooks/useVerseSearch'

const DEBOUNCE_MS = 400

export default function Search() {
  const [query, setQuery] = useState('')
  const [bookFilter, setBookFilter] = useState<string | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const { results, searching, runSearch, books } = useVerseSearch(debouncedQuery, bookFilter)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    runSearch()
  }, [debouncedQuery, bookFilter, runSearch])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold text-stone-900 dark:text-stone-100">
        Search
      </h1>
      <p className="mb-4 text-stone-600 dark:text-stone-400">
        This app uses the ESV. Verse-by-verse search is not available for ESV yet. Use the Bible reader to browse by book and chapter.
      </p>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search verses…"
          className="flex-1 rounded border border-stone-300 px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          aria-label="Search verses"
        />
        <select
          value={bookFilter ?? ''}
          onChange={(e) => setBookFilter(e.target.value || null)}
          className="rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          aria-label="Filter by book"
        >
          <option value="">All books</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.commonName}
            </option>
          ))}
        </select>
      </div>
      {searching && <p className="mb-2 text-sm text-stone-500">Searching…</p>}
      <ul className="space-y-2" aria-label="Search results">
        {!query.trim() && (
          <li className="text-stone-500 dark:text-stone-400">
            Enter a word or phrase to search within the Bible. Optionally filter by book.
          </li>
        )}
        {query.trim() && !searching && results.length === 0 && (
          <li className="text-stone-500 dark:text-stone-400">No verses found.</li>
        )}
        {results.slice(0, 100).map((r, i) => (
          <li key={`${r.bookId}-${r.chapter}-${r.verse}-${i}`}>
            <Link
              to={`/bible/${r.bookId}/${r.chapter}#v${r.verse}`}
              className="block rounded border border-stone-200 p-3 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800"
            >
              <span className="font-medium text-stone-900 dark:text-stone-100">
                {r.bookName} {r.chapter}:{r.verse}
              </span>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                {r.snippet}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {results.length > 100 && (
        <p className="mt-2 text-sm text-stone-500">
          Showing first 100 of {results.length} results.
        </p>
      )}
    </div>
  )
}
