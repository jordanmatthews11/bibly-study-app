import type {
  AvailableTranslations,
  Translation,
  TranslationBook,
  TranslationBooks,
  TranslationBookChapter,
} from '../types/bible'
import { validateBookChapter, validateTranslationId } from '../utils/validation'
import { ESV_BOOKS } from './esvApi'

const BASE = import.meta.env.VITE_BIBLE_API_BASE ?? 'https://bible.helloao.org/api'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json() as Promise<T>
}

export async function getTranslations(): Promise<AvailableTranslations> {
  return fetchJson<AvailableTranslations>(`${BASE}/available_translations.json`)
}

function syntheticEsvBooks(): TranslationBooks {
  const translation: Translation = {
    id: 'ESV',
    name: 'English Standard Version',
    englishName: 'English Standard Version',
    shortName: 'ESV',
    language: 'eng',
    textDirection: 'ltr',
    numberOfBooks: 66,
    totalNumberOfChapters: 1189,
    totalNumberOfVerses: 31102,
  }
  const books: TranslationBook[] = ESV_BOOKS.map((b) => ({
    ...b,
    name: b.commonName,
    title: null,
    firstChapterNumber: 1,
    lastChapterNumber: b.numberOfChapters,
    firstChapterApiLink: '#',
    lastChapterApiLink: '#',
    totalNumberOfVerses: 0,
  }))
  return { translation, books }
}

export async function getBooks(translationId: string): Promise<TranslationBooks> {
  if (translationId === 'ESV') return syntheticEsvBooks()
  return fetchJson<TranslationBooks>(`${BASE}/${translationId}/books.json`)
}

export async function getChapter(
  translationId: string,
  bookId: string,
  chapterNum: number
): Promise<TranslationBookChapter> {
  validateTranslationId(translationId)
  validateBookChapter(bookId, chapterNum)
  return fetchJson<TranslationBookChapter>(
    `${BASE}/${translationId}/${bookId}/${chapterNum}.json`
  )
}
