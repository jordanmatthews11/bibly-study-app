/**
 * ESV API (https://api.esv.org/) – requires an API key from https://api.esv.org/account/
 * Terms: https://api.esv.org/ – non-commercial use, include copyright and link to esv.org.
 *
 * Passage requests go through the serverless proxy (/api/esv) so the API key stays on the server.
 * For local dev with ESV, run `vercel dev` and set ESV_API_KEY in .env (no VITE_ prefix).
 */

const ESV_PROXY = '/api/esv'

export interface ESVPassageResponse {
  query: string
  canonical: string
  parsed: number[][]
  passage_meta: Array<{
    canonical: string
    chapter_start: number[]
    chapter_end: number[]
    prev_verse?: number
    next_verse?: number
    prev_chapter?: number[]
    next_chapter?: number[]
  }>
  passages: string[]
}

/** Book id (API style) to full name for ESV passage queries */
export const ESV_BOOK_NAMES: Record<string, string> = {
  GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy',
  JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
  '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles',
  EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalms',
  PRO: 'Proverbs', ECC: 'Ecclesiastes', SNG: 'Song of Solomon', ISA: 'Isaiah',
  JER: 'Jeremiah', LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel',
  HOS: 'Hosea', JOL: 'Joel', AMO: 'Amos', OBA: 'Obadiah', JON: 'Jonah',
  MIC: 'Micah', NAH: 'Nahum', HAB: 'Habakkuk', ZEP: 'Zephaniah', HAG: 'Haggai',
  ZEC: 'Zechariah', MAL: 'Malachi', MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke',
  JHN: 'John', ACT: 'Acts', ROM: 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians',
  GAL: 'Galatians', EPH: 'Ephesians', PHP: 'Philippians', COL: 'Colossians',
  '1TH': '1 Thessalonians', '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy',
  TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebrews', JAS: 'James', '1PE': '1 Peter',
  '2PE': '2 Peter', '1JN': '1 John', '2JN': '2 John', '3JN': '3 John', JUD: 'Jude',
  REV: 'Revelation',
}

/** Static book list for ESV (same 66 books, for book list when ESV is selected) */
export const ESV_BOOKS: { id: string; commonName: string; order: number; numberOfChapters: number }[] = [
  { id: 'GEN', commonName: 'Genesis', order: 1, numberOfChapters: 50 },
  { id: 'EXO', commonName: 'Exodus', order: 2, numberOfChapters: 40 },
  { id: 'LEV', commonName: 'Leviticus', order: 3, numberOfChapters: 27 },
  { id: 'NUM', commonName: 'Numbers', order: 4, numberOfChapters: 36 },
  { id: 'DEU', commonName: 'Deuteronomy', order: 5, numberOfChapters: 34 },
  { id: 'JOS', commonName: 'Joshua', order: 6, numberOfChapters: 24 },
  { id: 'JDG', commonName: 'Judges', order: 7, numberOfChapters: 21 },
  { id: 'RUT', commonName: 'Ruth', order: 8, numberOfChapters: 4 },
  { id: '1SA', commonName: '1 Samuel', order: 9, numberOfChapters: 31 },
  { id: '2SA', commonName: '2 Samuel', order: 10, numberOfChapters: 24 },
  { id: '1KI', commonName: '1 Kings', order: 11, numberOfChapters: 22 },
  { id: '2KI', commonName: '2 Kings', order: 12, numberOfChapters: 25 },
  { id: '1CH', commonName: '1 Chronicles', order: 13, numberOfChapters: 29 },
  { id: '2CH', commonName: '2 Chronicles', order: 14, numberOfChapters: 36 },
  { id: 'EZR', commonName: 'Ezra', order: 15, numberOfChapters: 10 },
  { id: 'NEH', commonName: 'Nehemiah', order: 16, numberOfChapters: 13 },
  { id: 'EST', commonName: 'Esther', order: 17, numberOfChapters: 10 },
  { id: 'JOB', commonName: 'Job', order: 18, numberOfChapters: 42 },
  { id: 'PSA', commonName: 'Psalms', order: 19, numberOfChapters: 150 },
  { id: 'PRO', commonName: 'Proverbs', order: 20, numberOfChapters: 31 },
  { id: 'ECC', commonName: 'Ecclesiastes', order: 21, numberOfChapters: 12 },
  { id: 'SNG', commonName: 'Song of Solomon', order: 22, numberOfChapters: 8 },
  { id: 'ISA', commonName: 'Isaiah', order: 23, numberOfChapters: 66 },
  { id: 'JER', commonName: 'Jeremiah', order: 24, numberOfChapters: 52 },
  { id: 'LAM', commonName: 'Lamentations', order: 25, numberOfChapters: 5 },
  { id: 'EZK', commonName: 'Ezekiel', order: 26, numberOfChapters: 48 },
  { id: 'DAN', commonName: 'Daniel', order: 27, numberOfChapters: 12 },
  { id: 'HOS', commonName: 'Hosea', order: 28, numberOfChapters: 14 },
  { id: 'JOL', commonName: 'Joel', order: 29, numberOfChapters: 3 },
  { id: 'AMO', commonName: 'Amos', order: 30, numberOfChapters: 9 },
  { id: 'OBA', commonName: 'Obadiah', order: 31, numberOfChapters: 1 },
  { id: 'JON', commonName: 'Jonah', order: 32, numberOfChapters: 4 },
  { id: 'MIC', commonName: 'Micah', order: 33, numberOfChapters: 7 },
  { id: 'NAH', commonName: 'Nahum', order: 34, numberOfChapters: 3 },
  { id: 'HAB', commonName: 'Habakkuk', order: 35, numberOfChapters: 3 },
  { id: 'ZEP', commonName: 'Zephaniah', order: 36, numberOfChapters: 3 },
  { id: 'HAG', commonName: 'Haggai', order: 37, numberOfChapters: 2 },
  { id: 'ZEC', commonName: 'Zechariah', order: 38, numberOfChapters: 14 },
  { id: 'MAL', commonName: 'Malachi', order: 39, numberOfChapters: 4 },
  { id: 'MAT', commonName: 'Matthew', order: 40, numberOfChapters: 28 },
  { id: 'MRK', commonName: 'Mark', order: 41, numberOfChapters: 16 },
  { id: 'LUK', commonName: 'Luke', order: 42, numberOfChapters: 24 },
  { id: 'JHN', commonName: 'John', order: 43, numberOfChapters: 21 },
  { id: 'ACT', commonName: 'Acts', order: 44, numberOfChapters: 28 },
  { id: 'ROM', commonName: 'Romans', order: 45, numberOfChapters: 16 },
  { id: '1CO', commonName: '1 Corinthians', order: 46, numberOfChapters: 16 },
  { id: '2CO', commonName: '2 Corinthians', order: 47, numberOfChapters: 13 },
  { id: 'GAL', commonName: 'Galatians', order: 48, numberOfChapters: 6 },
  { id: 'EPH', commonName: 'Ephesians', order: 49, numberOfChapters: 6 },
  { id: 'PHP', commonName: 'Philippians', order: 50, numberOfChapters: 4 },
  { id: 'COL', commonName: 'Colossians', order: 51, numberOfChapters: 4 },
  { id: '1TH', commonName: '1 Thessalonians', order: 52, numberOfChapters: 5 },
  { id: '2TH', commonName: '2 Thessalonians', order: 53, numberOfChapters: 3 },
  { id: '1TI', commonName: '1 Timothy', order: 54, numberOfChapters: 6 },
  { id: '2TI', commonName: '2 Timothy', order: 55, numberOfChapters: 4 },
  { id: 'TIT', commonName: 'Titus', order: 56, numberOfChapters: 3 },
  { id: 'PHM', commonName: 'Philemon', order: 57, numberOfChapters: 1 },
  { id: 'HEB', commonName: 'Hebrews', order: 58, numberOfChapters: 13 },
  { id: 'JAS', commonName: 'James', order: 59, numberOfChapters: 5 },
  { id: '1PE', commonName: '1 Peter', order: 60, numberOfChapters: 5 },
  { id: '2PE', commonName: '2 Peter', order: 61, numberOfChapters: 3 },
  { id: '1JN', commonName: '1 John', order: 62, numberOfChapters: 5 },
  { id: '2JN', commonName: '2 John', order: 63, numberOfChapters: 1 },
  { id: '3JN', commonName: '3 John', order: 64, numberOfChapters: 1 },
  { id: 'JUD', commonName: 'Jude', order: 65, numberOfChapters: 1 },
  { id: 'REV', commonName: 'Revelation', order: 66, numberOfChapters: 22 },
]

/** Client cannot know if server has key; always allow attempt. Key-not-configured shows as 502 from proxy. */
export function hasEsvApiKey(): boolean {
  return true
}

/**
 * Fetch passage text via serverless proxy (key stays on server).
 * @see https://api.esv.org/docs/passage-text/
 */
export async function getEsvPassage(query: string): Promise<ESVPassageResponse> {
  const url = `${ESV_PROXY}?q=${encodeURIComponent(query)}`
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) {
    const msg = res.status === 502 ? 'ESV API key not configured on server. Set ESV_API_KEY in Vercel (or .env for vercel dev).' : text
    throw new Error(`ESV API error ${res.status}: ${msg}`)
  }
  return JSON.parse(text) as Promise<ESVPassageResponse>
}

export interface ESVChapterResult {
  bookId: string
  bookName: string
  chapter: number
  passageText: string
  prev: { bookId: string; chapter: number } | null
  next: { bookId: string; chapter: number } | null
}

/**
 * Get a single chapter from ESV and return normalized result for the reader.
 */
export async function getEsvChapter(bookId: string, chapterNum: number): Promise<ESVChapterResult> {
  const bookName = ESV_BOOK_NAMES[bookId]
  if (!bookName) throw new Error(`Unknown book: ${bookId}`)
  const query = `${bookName} ${chapterNum}`
  const data = await getEsvPassage(query)
  const passageText = data.passages?.[0] ?? ''
  const meta = data.passage_meta?.[0]

  let prev: { bookId: string; chapter: number } | null = null
  let next: { bookId: string; chapter: number } | null = null
  if (meta?.prev_chapter?.length) {
    const [start] = meta.prev_chapter
    const parsed = parseEsvVerseId(start)
    if (parsed) prev = { bookId: parsed.bookId, chapter: parsed.chapter }
  }
  if (meta?.next_chapter?.length) {
    const [start] = meta.next_chapter
    const parsed = parseEsvVerseId(start)
    if (parsed) next = { bookId: parsed.bookId, chapter: parsed.chapter }
  }
  if (!prev && chapterNum > 1) {
    prev = { bookId, chapter: chapterNum - 1 }
  }
  if (!next) {
    const book = ESV_BOOKS.find((b) => b.id === bookId)
    if (book && chapterNum < book.numberOfChapters) next = { bookId, chapter: chapterNum + 1 }
    else if (book && chapterNum === book.numberOfChapters) {
      const nextBook = ESV_BOOKS.find((b) => b.order === book.order + 1)
      if (nextBook) next = { bookId: nextBook.id, chapter: 1 }
    }
  }

  return {
    bookId,
    bookName,
    chapter: chapterNum,
    passageText,
    prev,
    next,
  }
}

/** ESV verse ID is 8 digits: BBCCCVVV (book 2, chapter 3, verse 3). Book index is 1–66. */
function parseEsvVerseId(id: number): { bookId: string; chapter: number; verse: number } | null {
  const s = String(id).padStart(8, '0')
  const bookOrder = parseInt(s.slice(0, 2), 10)
  const chapter = parseInt(s.slice(2, 5), 10)
  const verse = parseInt(s.slice(5, 8), 10)
  const book = ESV_BOOKS.find((b) => b.order === bookOrder)
  if (!book || !chapter || !verse) return null
  return { bookId: book.id, chapter, verse }
}
