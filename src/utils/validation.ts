/**
 * Validation for URL construction and route params to prevent path traversal
 * and ensure only allowlisted book IDs and chapter ranges are used.
 */

import { ESV_BOOKS } from '../services/esvApi'

export const VALID_BOOK_IDS = new Set(ESV_BOOKS.map((b) => b.id))

const BOOK_BY_ID = new Map(ESV_BOOKS.map((b) => [b.id, b]))

/** Translation ID: ESV or alphanumeric/hyphen only, max 30 chars (no path traversal). */
export function isTranslationIdSafe(translationId: string): boolean {
  if (translationId === 'ESV') return true
  return /^[a-zA-Z0-9-]{1,30}$/.test(translationId)
}

/** Book ID must be in the 66-book allowlist. */
export function isBookIdValid(bookId: string): boolean {
  return VALID_BOOK_IDS.has(bookId)
}

/** Chapter must be a positive integer within the book's range. */
export function isChapterNumValid(bookId: string, chapterNum: number): boolean {
  const book = BOOK_BY_ID.get(bookId)
  if (!book) return false
  return Number.isInteger(chapterNum) && chapterNum >= 1 && chapterNum <= book.numberOfChapters
}

export function getBookById(bookId: string): { id: string; numberOfChapters: number } | undefined {
  return BOOK_BY_ID.get(bookId)
}

/** Throws if translationId is unsafe for URL path. */
export function validateTranslationId(translationId: string): void {
  if (!isTranslationIdSafe(translationId)) {
    throw new Error(`Invalid translation ID: ${translationId}`)
  }
}

/** Throws if bookId or chapterNum are invalid. */
export function validateBookChapter(bookId: string, chapterNum: number): void {
  if (!isBookIdValid(bookId)) throw new Error(`Invalid book ID: ${bookId}`)
  if (!isChapterNumValid(bookId, chapterNum)) {
    throw new Error(`Invalid chapter ${chapterNum} for book ${bookId}`)
  }
}
