import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { ESVChapterResult } from '../services/esvApi'
import { getEsvChapter, hasEsvApiKey, ESV_BOOK_NAMES, ESV_BOOKS } from '../services/esvApi'
import { parseEsvVerses } from '../utils/parseEsvVerses'
import { isBookIdValid, isChapterNumValid } from '../utils/validation'
import { usePassageChat } from '../context/PassageChatContext'
import { useFlashcards } from '../hooks/useFlashcards'
import { getTranslations } from '../services/bibleApi'
import { getChapter } from '../services/bibleApi'
import { getVerseText } from '../types/bible'

const PREFERRED_TRANSLATION_IDS = ['WEB', 'BSB', 'NKJV', 'KJV', 'ASV', 'YLT']

const NT_BOOK_IDS = new Set(ESV_BOOKS.filter((b) => b.order >= 40).map((b) => b.id))

function getGreekTranslationId(bookId: string): 'grc_sbl' | 'grc_bre' {
  return NT_BOOK_IDS.has(bookId) ? 'grc_sbl' : 'grc_bre'
}

function getGreekTranslationLabel(bookId: string): string {
  return NT_BOOK_IDS.has(bookId) ? 'SBL Greek NT' : 'Septuagint (LXX)'
}

/** Split verse text into tokens (words) for tap-to-highlight. Keeps punctuation attached. */
function tokenizeGreekVerse(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}

/** Simple Greek Unicode to Latin transliteration for display in word panel. */
function transliterateGreek(word: string): string {
  const map: Record<string, string> = {
    α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'ē', θ: 'th', ι: 'i', κ: 'k', λ: 'l', μ: 'm',
    ν: 'n', ξ: 'x', ο: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', φ: 'ph', χ: 'ch', ψ: 'ps', ω: 'ō',
    Α: 'A', Β: 'B', Γ: 'G', Δ: 'D', Ε: 'E', Ζ: 'Z', Η: 'Ē', Θ: 'Th', Ι: 'I', Κ: 'K', Λ: 'L', Μ: 'M',
    Ν: 'N', Ξ: 'X', Ο: 'O', Π: 'P', Ρ: 'R', Σ: 'S', Τ: 'T', Υ: 'Y', Φ: 'Ph', Χ: 'Ch', Ψ: 'Ps', Ω: 'Ō',
    ἀ: 'a', ἁ: 'ha', ἄ: 'a', ἅ: 'ha', ἐ: 'e', ἑ: 'he', ἔ: 'e', ἕ: 'he', ἠ: 'ē', ἡ: 'hē', ἤ: 'ē', ἥ: 'hē',
    ἰ: 'i', ἱ: 'hi', ἴ: 'i', ἵ: 'hi', ὀ: 'o', ὁ: 'ho', ὅ: 'o', ὕ: 'hy', ὑ: 'hy', ὠ: 'ō', ὡ: 'hō', ὤ: 'ō', ὥ: 'hō',
  }
  return word.split('').map((c) => map[c] ?? c).join('')
}

export default function BibleChapter() {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>()
  const chapterNum = chapter ? parseInt(chapter, 10) : 1
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(() => new Set())
  const [compareOpen, setCompareOpen] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [compareData, setCompareData] = useState<
    { id: string; name: string; verses: { number: number; text: string }[] }[]
  >([])
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareError, setCompareError] = useState<string | null>(null)
  const [greekOpen, setGreekOpen] = useState(false)
  const [greekData, setGreekData] = useState<{
    name: string
    verses: { number: number; text: string }[]
    isLxx: boolean
  } | null>(null)
  const [greekLoading, setGreekLoading] = useState(false)
  const [greekError, setGreekError] = useState<string | null>(null)
  const [selectedGreekWord, setSelectedGreekWord] = useState<{
    verseNumber: number
    token: string
  } | null>(null)
  const { setPassageContext, setChatOpen, setPendingPrompt } = usePassageChat()
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

  const handleWhyDoesItMatter = () => {
    setPendingPrompt(
      'Why does this passage matter? How does it fit in the bigger picture of this book and chapter?'
    )
    setChatOpen(true)
  }

  const selectedVerseText = useMemo(() => {
    if (!data) return ''
    const sorted = Array.from(selectedVerses).sort((a, b) => a - b)
    return sorted
      .map((n) => {
        const v = verses.find((x) => x.number === n)
        return v ? `${data.bookName} ${data.chapter}:${n} ${v.text}` : ''
      })
      .filter(Boolean)
      .join('\n\n')
  }, [data, selectedVerses, verses])

  const handleReadToMe = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !selectedVerseText) return
    const utterance = new SpeechSynthesisUtterance(selectedVerseText)
    utterance.rate = 0.9
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
  }

  const handleStopReading = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }

  useEffect(() => {
    if (!compareOpen || !data || !bookId || Number.isNaN(chapterNum) || selectedVerses.size === 0) {
      return
    }
    const sortedVerseNums = Array.from(selectedVerses).sort((a, b) => a - b)
    const esvEntries = sortedVerseNums.map((n) => {
      const v = verses.find((x) => x.number === n)
      return { number: n, text: v?.text ?? '' }
    })
    setCompareLoading(true)
    setCompareError(null)
    setCompareData([{ id: 'ESV', name: 'English Standard Version', verses: esvEntries }])
    getTranslations()
      .then(({ translations }) => {
        const english = translations.filter((t) => t.language === 'eng' && t.id !== 'ESV')
        const sortedTranslations = [...english].sort((a, b) => {
          const ai = PREFERRED_TRANSLATION_IDS.indexOf(a.id)
          const bi = PREFERRED_TRANSLATION_IDS.indexOf(b.id)
          if (ai !== -1 && bi !== -1) return ai - bi
          if (ai !== -1) return -1
          if (bi !== -1) return 1
          return (a.englishName ?? a.name).localeCompare(b.englishName ?? b.name)
        })
        const others = sortedTranslations.slice(0, 12)
        return Promise.all(
          others.map(async (t) => {
            try {
              const ch = await getChapter(t.id, data.bookId, data.chapter)
              const versesForTranslation = sortedVerseNums.map((num) => ({
                number: num,
                text: getVerseText(ch.chapter, num),
              }))
              return { id: t.id, name: t.name ?? t.shortName, verses: versesForTranslation }
            } catch {
              return null
            }
          })
        )
      })
      .then((results) => {
        const valid = results.filter(
          (r): r is { id: string; name: string; verses: { number: number; text: string }[] } =>
            r != null
        )
        setCompareData((prev) => [...prev, ...valid])
      })
      .catch((err) => setCompareError(err instanceof Error ? err.message : 'Failed to load translations'))
      .finally(() => setCompareLoading(false))
  }, [compareOpen, data, bookId, chapterNum, selectedVerses, verses])

  useEffect(() => {
    if (!compareOpen) {
      setCompareData([])
      setCompareError(null)
    }
  }, [compareOpen])

  useEffect(() => {
    if (!greekOpen) {
      setGreekData(null)
      setGreekError(null)
      setSelectedGreekWord(null)
      return
    }
    if (!data || !bookId || Number.isNaN(chapterNum)) return
    const sortedVerseNums = verses.map((v) => v.number)
    if (sortedVerseNums.length === 0) return
    const greekId = getGreekTranslationId(data.bookId)
    const label = getGreekTranslationLabel(data.bookId)
    const isLxx = greekId === 'grc_bre'
    setGreekLoading(true)
    setGreekError(null)
    getChapter(greekId, data.bookId, data.chapter)
      .then((ch) => {
        const verseEntries = sortedVerseNums.map((num) => ({
          number: num,
          text: getVerseText(ch.chapter, num),
        }))
        setGreekData({ name: label, verses: verseEntries, isLxx })
      })
      .catch((err) =>
        setGreekError(err instanceof Error ? err.message : 'Greek text is not available for this passage.')
      )
      .finally(() => setGreekLoading(false))
  }, [greekOpen, data, bookId, chapterNum, verses])

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
      <div className={`mx-auto flex gap-6 px-4 py-6 ${greekOpen ? 'max-w-6xl flex-row' : 'max-w-5xl flex-col md:flex-row'}`}>
        <div className="min-w-0 flex-1">
          <div className={greekOpen ? '' : 'max-w-2xl'}>
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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setGreekOpen((prev) => !prev)}
              className={`rounded border px-3 py-2 text-sm font-medium ${greekOpen ? 'border-warm-accent bg-warm-accent/10 text-warm-accent' : 'border-warm-border bg-warm-surface hover:bg-warm-hover'}`}
            >
              {greekOpen ? 'Hide Greek' : 'See in Greek'}
            </button>
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

        {greekOpen && (
          <div className="min-w-0 flex-1">
            <div className="rounded-lg border border-warm-border bg-warm-surface p-4">
              <p className="mb-3 text-sm font-medium text-warm-text">
                {greekData?.name ?? 'Greek'}
                {greekData?.isLxx && (
                  <span className="ml-2 text-xs font-normal text-warm-muted">
                    (LXX – verse numbering may differ)
                  </span>
                )}
              </p>
              {greekLoading && <p className="text-sm text-warm-muted">Loading Greek…</p>}
              {greekError && (
                <p className="text-sm text-red-600 dark:text-red-400">{greekError}</p>
              )}
              {!greekLoading && greekData && (
                <div className="space-y-2 font-serif text-warm-text">
                  {verses.map((v) => {
                    const greekVerse = greekData.verses.find((g) => g.number === v.number)
                    const text = greekVerse?.text ?? ''
                    const tokens = tokenizeGreekVerse(text)
                    return (
                      <div
                        key={v.number}
                        id={`greek-v${v.number}`}
                        className="rounded px-2 py-1.5 leading-relaxed"
                      >
                        <span className="mr-2 text-sm font-medium text-warm-muted">[{v.number}]</span>
                        {tokens.map((token, i) => {
                          const isSelected =
                            selectedGreekWord?.verseNumber === v.number && selectedGreekWord?.token === token
                          return (
                            <span key={`${v.number}-${i}-${token}`}>
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={() => setSelectedGreekWord({ verseNumber: v.number, token })}
                                onKeyDown={(e) =>
                                  e.key === 'Enter' && setSelectedGreekWord({ verseNumber: v.number, token })
                                }
                                className={`cursor-pointer rounded px-0.5 transition-colors ${
                                  isSelected
                                    ? 'bg-amber-200/80 ring-1 ring-amber-400 dark:bg-amber-900/40 dark:ring-amber-600'
                                    : 'hover:bg-warm-hover'
                                }`}
                                aria-label={`Greek word ${token}`}
                              >
                                {token}
                              </span>
                              {i < tokens.length - 1 ? ' ' : null}
                            </span>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedVerses.size > 0 && (
          <aside className="w-full shrink-0 md:sticky md:top-20 md:h-fit md:w-72">
            <div className="rounded-lg border border-warm-border bg-warm-surface p-4">
              <p className="mb-3 text-sm font-medium text-warm-text">
                Selected verses – choose an action
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleAddAsOneCard}
                  className="rounded bg-warm-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Memorize with Flashcards
                </button>
                <button
                  type="button"
                  onClick={handleWhyDoesItMatter}
                  className="rounded border border-warm-border bg-warm-bg px-3 py-2 text-sm font-medium text-warm-text hover:bg-warm-hover"
                >
                  Why does it matter?
                </button>
                <button
                  type="button"
                  onClick={handleReadToMe}
                  disabled={!selectedVerseText}
                  className="rounded border border-warm-border bg-warm-bg px-3 py-2 text-sm font-medium text-warm-text hover:bg-warm-hover disabled:opacity-50"
                >
                  Read to me
                </button>
                {speaking && (
                  <button
                    type="button"
                    onClick={handleStopReading}
                    className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-300"
                  >
                    Stop
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCompareOpen(true)}
                  className="rounded border border-warm-border bg-warm-bg px-3 py-2 text-sm font-medium text-warm-text hover:bg-warm-hover"
                >
                  Compare to other translations
                </button>
                <button
                  type="button"
                  onClick={() => setGreekOpen((prev) => !prev)}
                  className={`rounded border px-3 py-2 text-sm font-medium ${greekOpen ? 'border-warm-accent bg-warm-accent/10 text-warm-accent' : 'border-warm-border bg-warm-bg hover:bg-warm-hover'}`}
                >
                  {greekOpen ? 'Hide Greek' : 'See in Greek'}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-warm-border pt-3">
                <span className="text-xs text-warm-muted">Flashcards:</span>
                <button
                  type="button"
                  onClick={handleAddEachVerse}
                  className="rounded border border-warm-border px-2 py-1 text-xs font-medium text-warm-muted hover:bg-warm-hover"
                >
                  Add each verse
                </button>
                <button
                  type="button"
                  onClick={handleAddAsOneCard}
                  className="rounded border border-warm-border px-2 py-1 text-xs font-medium text-warm-muted hover:bg-warm-hover"
                >
                  Add as one card
                </button>
                <Link
                  to="/flashcards"
                  className="text-xs text-warm-accent underline"
                >
                  Open Flashcards
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>

        {compareOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50"
              role="button"
              tabIndex={0}
              onClick={() => setCompareOpen(false)}
              onKeyDown={(e) => e.key === 'Escape' && setCompareOpen(false)}
              aria-label="Close"
            />
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-warm-border bg-warm-surface p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-warm-text">Compare to other translations</h2>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  className="rounded p-1 text-warm-muted hover:bg-warm-hover hover:text-warm-text"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {compareLoading && compareData.length <= 1 && (
                <p className="text-sm text-warm-muted">Loading other translations…</p>
              )}
              {compareError && (
                <p className="text-sm text-red-600 dark:text-red-400">{compareError}</p>
              )}
              <div className="max-h-[60vh] space-y-4 overflow-y-auto">
                {compareData.map(({ id, name, verses: transVerses }) => (
                  <div key={id} className="rounded border border-warm-border p-3">
                    <p className="mb-2 text-sm font-medium text-warm-text">{name}</p>
                    <div className="space-y-1 text-sm text-warm-muted">
                      {transVerses.map(({ number, text }) => (
                        <p key={number}>
                          <span className="font-medium text-warm-text">[{number}]</span> {text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {!compareLoading && compareData.length <= 2 && (
                <p className="mt-3 text-xs text-warm-muted">
                  Other translations may not be available for this passage.
                </p>
              )}
            </div>
          </>
        )}

        {selectedGreekWord && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-warm-border bg-warm-surface p-4 shadow-lg">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-warm-text">
                  Word: <span className="font-serif">{selectedGreekWord.token}</span>
                </p>
                <p className="text-sm text-warm-muted">
                  Transliteration: {transliterateGreek(selectedGreekWord.token)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGreekWord(null)}
                className="rounded p-2 text-warm-muted hover:bg-warm-hover hover:text-warm-text"
                aria-label="Close word panel"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
    </div>
  )
}
