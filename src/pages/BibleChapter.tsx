import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { ESVChapterResult } from '../services/esvApi'
import { getEsvChapter, hasEsvApiKey, ESV_BOOK_NAMES } from '../services/esvApi'
import { parseEsvVerses } from '../utils/parseEsvVerses'
import { usePassageChat } from '../context/PassageChatContext'

export default function BibleChapter() {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>()
  const chapterNum = chapter ? parseInt(chapter, 10) : 1
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(() => new Set())
  const { setPassageContext } = usePassageChat()

  useEffect(() => {
    setSelectedVerses(new Set())
  }, [bookId, chapterNum])

  const { data, isLoading, error } = useQuery<ESVChapterResult>({
    queryKey: ['chapter', 'ESV', bookId, chapterNum],
    queryFn: () => getEsvChapter(bookId!, chapterNum),
    enabled: Boolean(bookId && !Number.isNaN(chapterNum) && hasEsvApiKey()),
  })

  const verses = useMemo(
    () => parseEsvVerses(data?.passageText ?? ''),
    [data?.passageText]
  )

  useEffect(() => {
    if (!data) {
      setPassageContext(null)
      return
    }
    setPassageContext({
      bookId: data.bookId,
      bookName: data.bookName,
      chapter: data.chapter,
      parsedVerses: verses,
      selectedVerseNumbers: Array.from(selectedVerses),
    })
    return () => setPassageContext(null)
  }, [data, verses, selectedVerses, setPassageContext])

  const toggleVerse = (num: number) => {
    setSelectedVerses((prev) => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  if (!bookId || Number.isNaN(chapterNum)) {
    return (
      <div className="p-6">
        <Link to="/bible" className="text-stone-600 underline dark:text-stone-400">
          Back to Bible
        </Link>
      </div>
    )
  }

  if (!hasEsvApiKey()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="mb-2 text-stone-700 dark:text-stone-300">
          An ESV API key is required to read the Bible.
        </p>
        <p className="mb-2 text-sm text-stone-600 dark:text-stone-400">
          Get a free key at{' '}
          <a href="https://api.esv.org/account/" target="_blank" rel="noopener noreferrer" className="underline">
            api.esv.org/account
          </a>
          , then set <code className="rounded bg-stone-200 px-1 dark:bg-stone-700">VITE_ESV_API_KEY</code> in your <code className="rounded bg-stone-200 px-1 dark:bg-stone-700">.env</code> and restart the dev server.
        </p>
        <Link to="/bible" className="text-stone-600 underline dark:text-stone-400">
          Back to Bible
        </Link>
      </div>
    )
  }

  if (isLoading) return <div className="p-6">Loading chapter…</div>
  if (error) return <div className="p-6 text-red-600">Failed to load chapter.</div>
  if (!data) return null

  const esvData = data

  return (
    <div className="min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <nav className="mb-4 flex items-center gap-2 text-sm">
          <Link to="/bible" className="text-stone-600 underline dark:text-stone-400">
            Bible
          </Link>
          <span className="text-stone-400">/</span>
          <span className="font-medium text-stone-900 dark:text-stone-100">
            {esvData.bookName} {esvData.chapter}
          </span>
        </nav>
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            {esvData.bookName} {esvData.chapter}
          </h1>
          <div className="flex gap-2">
            {esvData.prev && (
              <Link
                to={`/bible/${esvData.prev.bookId}/${esvData.prev.chapter}`}
                className="rounded border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700"
              >
                Previous
              </Link>
            )}
            {esvData.next && (
              <Link
                to={`/bible/${esvData.next.bookId}/${esvData.next.chapter}`}
                className="rounded border border-stone-300 bg-white px-3 py-2 text-sm font-medium hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700"
              >
                Next
              </Link>
            )}
          </div>
        </header>
        <article className="prose prose-stone dark:prose-invert max-w-none">
          {verses.length > 0 ? (
            <div className="space-y-1 font-sans text-inherit leading-relaxed">
              {verses.map((v) => {
                const selected = selectedVerses.has(v.number)
                return (
                  <div
                    key={v.number}
                    id={`v${v.number}`}
                    data-verse={v.number}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleVerse(v.number)}
                    onKeyDown={(e) => e.key === 'Enter' && toggleVerse(v.number)}
                    className={`cursor-pointer rounded px-2 py-1.5 transition-colors ${
                      selected
                        ? 'bg-amber-200/80 ring-1 ring-amber-400 dark:bg-amber-900/40 dark:ring-amber-600'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                    aria-pressed={selected}
                    aria-label={`Verse ${v.number}${selected ? ', selected' : ''}`}
                  >
                    <span className="mr-2 font-medium text-stone-500 dark:text-stone-400">
                      [{v.number}]
                    </span>
                    <span className="whitespace-pre-wrap">{v.text}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-inherit leading-relaxed">
              {esvData.passageText}
            </pre>
          )}
        </article>
        <footer className="mt-8 space-y-2 border-t border-stone-200 pt-4 dark:border-stone-700">
          <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
            {esvData.prev ? (
              <Link to={`/bible/${esvData.prev.bookId}/${esvData.prev.chapter}`} className="underline">
                ← {ESV_BOOK_NAMES[esvData.prev.bookId] ?? esvData.prev.bookId} {esvData.prev.chapter}
              </Link>
            ) : (
              <span />
            )}
            {esvData.next ? (
              <Link to={`/bible/${esvData.next.bookId}/${esvData.next.chapter}`} className="underline">
                {ESV_BOOK_NAMES[esvData.next.bookId] ?? esvData.next.bookId} {esvData.next.chapter} →
              </Link>
            ) : (
              <span />
            )}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.{' '}
            <a href="https://www.esv.org" target="_blank" rel="noopener noreferrer" className="underline">
              esv.org
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
