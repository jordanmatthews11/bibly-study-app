import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudy } from '../hooks/useStudyStorage'

const BOOK_ORDER: Record<string, number> = {}
const BOOK_IDS = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAH', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
]
BOOK_IDS.forEach((id, i) => { BOOK_ORDER[id] = i })

function formatRef(bookId: string, chapter: number, verse?: number): string {
  return `${bookId} ${chapter}${verse != null ? `:${verse}` : ''}`
}

export default function Study() {
  const [tab, setTab] = useState<'bookmarks' | 'highlights' | 'notes'>('bookmarks')
  const { bookmarks, highlights, notes, removeBookmark, removeHighlight, removeNote } = useStudy()

  const sortedBookmarks = [...bookmarks].sort(
    (a, b) =>
      (BOOK_ORDER[a.bookId] ?? 999) - (BOOK_ORDER[b.bookId] ?? 999) ||
      a.chapter - b.chapter ||
      (a.verse ?? 0) - (b.verse ?? 0)
  )
  const sortedHighlights = [...highlights].sort(
    (a, b) =>
      (BOOK_ORDER[a.bookId] ?? 999) - (BOOK_ORDER[b.bookId] ?? 999) ||
      a.chapter - b.chapter ||
      a.verse - b.verse
  )
  const sortedNotes = [...notes].sort(
    (a, b) =>
      (BOOK_ORDER[a.bookId] ?? 999) - (BOOK_ORDER[b.bookId] ?? 999) ||
      a.chapter - b.chapter ||
      a.verse - b.verse
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold text-warm-text">
        Study
      </h1>
      <p className="mb-4 text-warm-muted">
        Your bookmarks, highlights, and notes. Click a reference to open the passage.
      </p>
      <div className="mb-4 flex gap-2 border-b border-warm-border">
        {(['bookmarks', 'highlights', 'notes'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 px-3 py-2 text-sm font-medium capitalize ${
              tab === t
                ? 'border-warm-accent text-warm-accent'
                : 'border-transparent text-warm-muted hover:text-warm-text'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'bookmarks' && (
        <ul className="space-y-2" aria-label="Bookmarks">
          {sortedBookmarks.length === 0 && (
            <li className="text-warm-muted">
              No bookmarks yet. Bookmark verses from the Bible reader.
            </li>
          )}
          {sortedBookmarks.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between gap-2 rounded border border-warm-border p-3"
            >
              <Link
                to={`/bible/${b.bookId}/${b.chapter}${b.verse != null ? `#v${b.verse}` : ''}`}
                className="flex-1 font-medium text-warm-text hover:underline"
              >
                {formatRef(b.bookId, b.chapter, b.verse)}
                {b.label && ` – ${b.label}`}
              </Link>
              <button
                type="button"
                onClick={() => removeBookmark(b.id)}
                className="rounded px-2 py-1 text-sm text-warm-muted hover:bg-warm-hover hover:text-warm-text"
                aria-label={`Remove bookmark ${formatRef(b.bookId, b.chapter, b.verse)}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {tab === 'highlights' && (
        <ul className="space-y-2" aria-label="Highlights">
          {sortedHighlights.length === 0 && (
            <li className="text-warm-muted">
              No highlights yet. Highlight verses from the Bible reader.
            </li>
          )}
          {sortedHighlights.map((h) => (
            <li
              key={h.id}
              className="flex items-center justify-between gap-2 rounded border border-warm-border p-3"
            >
              <Link
                to={`/bible/${h.bookId}/${h.chapter}#v${h.verse}`}
                className="flex-1 font-medium text-warm-text hover:underline"
              >
                {formatRef(h.bookId, h.chapter, h.verse)}
              </Link>
              <button
                type="button"
                onClick={() => removeHighlight(h.bookId, h.chapter, h.verse)}
                className="rounded px-2 py-1 text-sm text-warm-muted hover:bg-warm-hover hover:text-warm-text"
                aria-label={`Remove highlight ${formatRef(h.bookId, h.chapter, h.verse)}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {tab === 'notes' && (
        <ul className="space-y-2" aria-label="Notes">
          {sortedNotes.length === 0 && (
            <li className="text-warm-muted">
              No notes yet. Add notes to verses from the Bible reader.
            </li>
          )}
          {sortedNotes.map((n) => (
            <li
              key={n.id}
              className="rounded border border-warm-border p-3"
            >
              <Link
                to={`/bible/${n.bookId}/${n.chapter}#v${n.verse}`}
                className="font-medium text-warm-text hover:underline"
              >
                {formatRef(n.bookId, n.chapter, n.verse)}
              </Link>
              <p className="mt-1 text-sm text-warm-muted line-clamp-2">
                {n.content}
              </p>
              <button
                type="button"
                onClick={() => removeNote(n.bookId, n.chapter, n.verse)}
                className="mt-2 text-sm text-warm-muted hover:text-warm-text"
                aria-label={`Remove note ${formatRef(n.bookId, n.chapter, n.verse)}`}
              >
                Remove note
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
