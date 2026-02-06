import { useState, useRef, useEffect } from 'react'
import { useStudy } from '../hooks/useStudyStorage'

const HIGHLIGHT_COLORS = [
  { id: 'yellow' as const, label: 'Yellow', class: 'bg-yellow-200' },
  { id: 'green' as const, label: 'Green', class: 'bg-green-200' },
  { id: 'blue' as const, label: 'Blue', class: 'bg-blue-200' },
  { id: 'red' as const, label: 'Red', class: 'bg-red-200' },
]

export default function VerseActions({
  bookId,
  chapter,
  verse,
}: {
  bookId: string
  chapter: number
  verse: number
  verseText?: string
}) {
  const {
    hasBookmark,
    getBookmark,
    addBookmark,
    removeBookmark,
    getHighlight,
    addHighlight,
    removeHighlight,
    getNote,
    addNote,
    removeNote,
  } = useStudy()
  const [showHighlight, setShowHighlight] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const bookmarked = hasBookmark(bookId, chapter, verse)
  const highlight = getHighlight(bookId, chapter, verse)
  const note = getNote(bookId, chapter, verse)

  useEffect(() => {
    if (note) setNoteContent(note.content)
  }, [note])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowHighlight(false)
        setShowNote(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative flex shrink-0 items-center gap-1 opacity-70 hover:opacity-100" ref={ref}>
      <button
        type="button"
        onClick={() => {
          const b = getBookmark(bookId, chapter, verse)
          if (b) removeBookmark(b.id)
          else addBookmark(bookId, chapter, verse)
        }}
        className="rounded p-1 hover:bg-warm-hover"
        title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark verse'}
      >
        {bookmarked ? (
          <span className="text-amber-500" aria-hidden>★</span>
        ) : (
          <span className="text-warm-muted" aria-hidden>☆</span>
        )}
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowHighlight((o) => !o)}
          className="rounded p-1 hover:bg-warm-hover"
          title="Highlight"
          aria-label="Highlight verse"
          aria-expanded={showHighlight}
        >
          <span
            className="inline-block h-4 w-4 rounded border border-warm-muted"
            style={
              highlight
                ? {
                    backgroundColor:
                      highlight.color === 'yellow'
                        ? 'rgb(254,240,138)'
                        : highlight.color === 'green'
                          ? 'rgb(187,247,208)'
                          : highlight.color === 'blue'
                            ? 'rgb(191,219,254)'
                            : 'rgb(254,202,202)',
                  }
                : undefined
            }
          />
        </button>
        {showHighlight && (
          <div className="absolute right-0 top-full z-10 mt-1 flex gap-1 rounded border border-warm-border bg-warm-surface p-2 shadow-lg">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                title={c.label}
                className={`h-6 w-6 rounded border border-warm-border ${c.class}`}
                onClick={() => {
                  if (highlight?.color === c.id) removeHighlight(bookId, chapter, verse)
                  else addHighlight(bookId, chapter, verse, c.id)
                  setShowHighlight(false)
                }}
              />
            ))}
            {highlight && (
              <button
                type="button"
                className="rounded px-2 py-1 text-xs text-warm-muted hover:bg-warm-hover"
                onClick={() => {
                  removeHighlight(bookId, chapter, verse)
                  setShowHighlight(false)
                }}
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowNote((o) => !o)}
          className="rounded p-1 hover:bg-warm-hover"
          title="Note"
          aria-label="Add or edit note"
          aria-expanded={showNote}
        >
          <span className={note ? 'text-amber-600 dark:text-amber-400' : 'text-warm-muted'}>
            📝
          </span>
        </button>
        {showNote && (
          <div className="absolute right-0 top-full z-10 mt-1 w-64 rounded border border-warm-border bg-warm-surface p-2 shadow-lg">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Your note…"
              className="mb-2 w-full rounded border border-warm-border px-2 py-1 text-sm text-warm-text bg-warm-surface"
              rows={3}
            />
            <div className="flex justify-end gap-1">
              <button
                type="button"
                className="rounded px-2 py-1 text-sm text-warm-muted hover:bg-warm-hover"
                onClick={() => setShowNote(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-warm-accent px-2 py-1 text-sm text-white hover:bg-warm-accent-hover"
                onClick={() => {
                  if (noteContent.trim()) addNote(bookId, chapter, verse, noteContent.trim())
                  else removeNote(bookId, chapter, verse)
                  setShowNote(false)
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
