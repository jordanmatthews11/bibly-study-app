import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getCharacters } from '../services/characterApi'

const BOOK_IDS = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAH', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
]

export default function Characters() {
  const [nameFilter, setNameFilter] = useState('')
  const [bookFilter, setBookFilter] = useState<string | null>(null)

  const characters = useMemo(() => getCharacters(), [])
  const filtered = useMemo(() => {
    return characters.filter((c) => {
      const matchName = !nameFilter.trim() || c.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
      const matchBook = !bookFilter || c.reference?.bookId === bookFilter
      return matchName && matchBook
    })
  }, [characters, nameFilter, bookFilter])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold text-stone-900 dark:text-stone-100">
        Bible Characters
      </h1>
      <p className="mb-4 text-stone-600 dark:text-stone-400">
        People and figures from the Bible with short profiles and key references.
      </p>
      <p className="mb-3 text-sm text-stone-500 dark:text-stone-400">
        Filter the list below by name or book. Characters are from our curated database.
      </p>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Filter by name (e.g. Abraham, David)"
          className="flex-1 rounded border border-stone-300 px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          aria-label="Filter characters by name"
        />
        <select
          value={bookFilter ?? ''}
          onChange={(e) => setBookFilter(e.target.value || null)}
          className="rounded border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          aria-label="Filter by book"
        >
          <option value="">All books</option>
          {BOOK_IDS.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-2 text-sm text-stone-500 dark:text-stone-400">
        {filtered.length === characters.length
          ? `Showing all ${characters.length} characters`
          : `Showing ${filtered.length} of ${characters.length} characters`}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Character list">
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              to={`/characters/${c.id}`}
              className="block rounded border border-stone-200 p-3 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800"
            >
              <span className="font-medium text-stone-900 dark:text-stone-100">
                {c.name}
              </span>
              {c.reference && (
                <span className="mt-1 block text-sm text-stone-500 dark:text-stone-400">
                  {c.reference.bookId} {c.reference.chapter}:{c.reference.verse}
                  {c.reference.endVerse && c.reference.endVerse !== c.reference.verse
                    ? `–${c.reference.endVerse}`
                    : ''}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="text-stone-500 dark:text-stone-400">No characters match your filters.</p>
      )}
    </div>
  )
}
