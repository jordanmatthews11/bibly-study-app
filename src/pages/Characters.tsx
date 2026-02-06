import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { BibleCharacter, BibleCharacterReference } from '../types/character'
import { getCharacters } from '../services/characterApi'
import { formatReference } from '../utils/formatReference'

const BOOK_IDS = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAH', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
]

function characterBookIds(c: { reference: { bookId: string } | null; passages?: { bookId: string }[] }): Set<string> {
  const ids = new Set<string>()
  if (c.reference?.bookId) ids.add(c.reference.bookId)
  c.passages?.forEach((p) => ids.add(p.bookId))
  return ids
}

function sameRef(a: BibleCharacterReference, b: BibleCharacterReference): boolean {
  return a.bookId === b.bookId && a.chapter === b.chapter && a.verse === b.verse
}

function passageCount(c: BibleCharacter): number {
  let n = c.reference ? 1 : 0
  if (c.passages) n += c.passages.length
  if (c.reference && c.passages?.some((p) => sameRef(p, c.reference!))) n -= 1
  return Math.max(n, 0)
}

export default function Characters() {
  const [nameFilter, setNameFilter] = useState('')
  const [bookFilter, setBookFilter] = useState<string | null>(null)

  const characters = useMemo(() => getCharacters(), [])
  const filtered = useMemo(() => {
    return characters.filter((c) => {
      const matchName = !nameFilter.trim() || c.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
      const matchBook = !bookFilter || characterBookIds(c).has(bookFilter)
      return matchName && matchBook
    })
  }, [characters, nameFilter, bookFilter])

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold text-warm-text">
        Bible Characters
      </h1>
      <p className="mb-4 text-warm-muted">
        People and figures from the Bible with short profiles and key references.
      </p>
      <p className="mb-3 text-sm text-warm-muted">
        Filter the list below by name or book. Characters are from our curated database.
      </p>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Filter by name (e.g. Abraham, David)"
          className="flex-1 rounded border border-warm-border px-3 py-2 text-warm-text bg-warm-surface"
          aria-label="Filter characters by name"
        />
        <select
          value={bookFilter ?? ''}
          onChange={(e) => setBookFilter(e.target.value || null)}
          className="rounded border border-warm-border bg-warm-surface px-3 py-2 text-warm-text"
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
      <p className="mb-2 text-sm text-warm-muted">
        {filtered.length === characters.length
          ? `Showing all ${characters.length} characters`
          : `Showing ${filtered.length} of ${characters.length} characters`}
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Character list">
        {filtered.map((c) => {
          const count = passageCount(c)
          return (
            <li key={c.id}>
              <Link
                to={`/characters/${c.id}`}
                className="block rounded border border-warm-border p-3 hover:bg-warm-hover"
              >
                <span className="font-medium text-warm-text">
                  {c.name}
                </span>
                {c.reference && (
                  <span className="mt-1 block text-sm text-warm-muted">
                    {formatReference(c.reference)}
                  </span>
                )}
                {count > 1 && (
                  <span className="mt-0.5 block text-xs text-warm-muted">
                    {count} passages
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
      {filtered.length === 0 && (
        <p className="text-warm-muted">No characters match your filters.</p>
      )}
    </div>
  )
}
