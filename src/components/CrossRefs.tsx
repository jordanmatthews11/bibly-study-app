import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCrossReferences } from '../services/crossRefApi'
import type { CrossRefRef } from '../services/crossRefApi'

function formatRef(r: CrossRefRef): string {
  return `${r.book} ${r.chapter}:${r.verse}${r.endVerse && r.endVerse !== r.verse ? `-${r.endVerse}` : ''}`
}

export default function CrossRefs({
  bookId,
  chapter,
  verse,
}: {
  bookId: string
  chapter: number
  verse: number
}) {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['crossref', bookId, chapter],
    queryFn: () => getCrossReferences(bookId, chapter),
    enabled: open,
  })

  const verseRefs = data?.chapter?.content?.find((c) => c.verse === verse)?.references ?? []
  const topRefs = verseRefs.slice(0, 10)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded px-1.5 py-0.5 text-xs text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 dark:hover:text-stone-400"
        title="Cross-references"
        aria-expanded={open}
        aria-label={`Cross-references for verse ${verse}`}
      >
        ↪
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded border border-stone-200 bg-white p-2 shadow-lg dark:border-stone-700 dark:bg-stone-800">
          <div className="mb-1 text-xs font-medium text-stone-500 dark:text-stone-400">
            Cross-references
          </div>
          {isLoading && <p className="text-xs text-stone-500">Loading…</p>}
          {!isLoading && topRefs.length === 0 && (
            <p className="text-xs text-stone-500">None</p>
          )}
          <ul className="max-h-40 overflow-auto text-xs">
            {topRefs.map((r, i) => (
              <li key={i}>
                <Link
                  to={`/bible/${r.book}/${r.chapter}#v${r.verse}`}
                  className="block rounded py-0.5 text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-700"
                  onClick={() => setOpen(false)}
                >
                  {formatRef(r)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
