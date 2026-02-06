import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { ESVChapterResult } from '../services/esvApi'
import { getEsvChapter, hasEsvApiKey, ESV_BOOK_NAMES } from '../services/esvApi'
import { parseEsvVerses } from '../utils/parseEsvVerses'
import { isBookIdValid, isChapterNumValid } from '../utils/validation'
import { usePassageChat } from '../context/PassageChatContext'
import { useFlashcards } from '../hooks/useFlashcards'

export default function BibleChapter() {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>()
  const chapterNum = chapter ? parseInt(chapter, 10) : 1
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(() => new Set())
  const { setPassageContext } = usePassageChat()
  const { addCards } = useFlashcards()

  useEffect(() => {
    setSelectedVerses(new Set())
  }, [bookId, chapterNum])

  const paramsValid =
    Boolean(bookId && !Number.isNaN(chapterNum)) &&
    isBookIdValid(bookId!) &&
    isChapterNumValid(bookId!, chapterNum)

  const { data, isLoading, error } = useQuery<ESVChapterResult>({
    queryKey: ['chapter', 'ESV', bookId, chapterNum],
    queryFn: () => getEsvChapter(bookId!, chapterNum),
    enabled: Boolean(paramsValid && hasEsvApiKey()),
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

  const handleAddEachVerse = () => {
    if (!data || selectedVerses.size === 0) return
    const bookName = ESV_BOOK_NAMES[data.bookId] ?? data.bookId
    const sorted = Array.from(selectedVerses).sort((a, b) => a - b)
    const cards = sorted.map((verseNum) => {
      const v = verses.find((x) => x.number === verseNum)
      const text = v?.text ?? ''
      const referenceLabel = `${bookName} ${data.chapter}:${verseNum}`
      return {
        bookId: data.bookId,
        chapter: data.chapter,
        verseStart: verseNum,
        verseEnd: verseNum,
        referenceLabel,
        text,
      }
    })
    addCards(cards)
    setSelectedVerses(new Set())
  }
  const handleAddAsOneCard = () => {
    if (!data || selectedVerses.size === 0) return
    const bookName = ESV_BOOK_NAMES[data.bookId] ?? data.bookId
    const sorted = Array.from(selectedVerses).sort((a, b) => a - b)
    const verseStart = sorted[0]
    const verseEnd = sorted[sorted.length - 1]
    const referenceLabel =
      verseStart === verseEnd
        ? `${bookName} ${data.chapter}:${verseStart}`
        : `${bookName} ${data.chapter}:${verseStart}–${verseEnd}`
    const text = sorted
      .map((n) => {
        const v = verses.find((x) => x.number === n)
        return v ? `[${n}] ${v.text}` : ''
      })
      .filter(Boolean)
      .join('\n')
    addCards([
      { bookId: data.bookId, chapter: data.chapter, verseStart, verseEnd, referenceLabel, text },
    ])
    setSelectedVerses(new Set())
  }

  if (!bookId || Number.isNaN(chapterNum)) {
    return (
      <div className="p-6">
        <Link to="/bible" className="text-warm-muted underline">
          Back to Bible
        </Link>
      </div>
    )
  }

  const isKeyNotConfigured =
    error instanceof Error &&
    (error.message.includes('502') || error.message.includes('not configured'))

  if (isKeyNotConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="mb-2 text-warm-text">
          An ESV API key is required to read the Bible.
        </p>
        <p className="mb-2 text-sm text-warm-muted">
          Get a free key at{' '}
          <a href="https://api.esv.org/account/" target="_blank" rel="noopener noreferrer" className="underline">
            api.esv.org/account
          </a>
          , then set <code className="rounded bg-warm-hover px-1">ESV_API_KEY</code> in your Vercel project env (or in <code className="rounded bg-warm-hover px-1">.env</code> when using <code className="rounded bg-warm-hover px-1">vercel dev</code>).
        </p>
        <Link to="/bible" className="text-warm-muted underline">
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
          <Link to="/bible" className="text-warm-muted underline">
            Bible
          </Link>
          <span className="text-warm-muted">/</span>
          <span className="font-medium text-warm-text">
            {esvData.bookName} {esvData.chapter}
          </span>
        </nav>
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-warm-text">
            {esvData.bookName} {esvData.chapter}
          </h1>
          <div className="flex gap-2">
            {esvData.prev && (
              <Link
                to={`/bible/${esvData.prev.bookId}/${esvData.prev.chapter}`}
                className="rounded border border-warm-border bg-warm-surface px-3 py-2 text-sm font-medium hover:bg-warm-hover"
              >
                Previous
              </Link>
            )}
            {esvData.next && (
              <Link
                to={`/bible/${esvData.next.bookId}/${esvData.next.chapter}`}
                className="rounded border border-warm-border bg-warm-surface px-3 py-2 text-sm font-medium hover:bg-warm-hover"
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
                        : 'hover:bg-warm-hover'
                    }`}
                    aria-pressed={selected}
                    aria-label={`Verse ${v.number}${selected ? ', selected' : ''}`}
                  >
                    <span className="mr-2 font-medium text-warm-muted">
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
        {selectedVerses.size > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-600 dark:bg-amber-900/20">
            <span className="text-sm font-medium text-warm-text">
              Add to flashcards
            </span>
            <button
              type="button"
              onClick={handleAddEachVerse}
              className="rounded border border-amber-400 bg-amber-100 px-3 py-1.5 text-sm font-medium text-warm-text hover:bg-amber-200 dark:border-amber-500 dark:bg-amber-800/50 dark:hover:bg-amber-800"
            >
              Add each verse
            </button>
            <button
              type="button"
              onClick={handleAddAsOneCard}
              className="rounded border border-amber-400 bg-amber-100 px-3 py-1.5 text-sm font-medium text-warm-text hover:bg-amber-200 dark:border-amber-500 dark:bg-amber-800/50 dark:hover:bg-amber-800"
            >
              Add as one card
            </button>
            <Link
              to="/flashcards"
              className="ml-auto text-sm text-amber-700 underline dark:text-amber-400"
            >
              Open Flashcards
            </Link>
          </div>
        )}
        <footer className="mt-8 space-y-2 border-t border-warm-border pt-4">
          <div className="flex justify-between text-sm text-warm-muted">
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
          <p className="text-xs text-warm-muted">
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
