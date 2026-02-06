import type { BibleCharacterReference } from '../types/character'
import { ESV_BOOK_NAMES, ESV_BOOKS } from '../services/esvApi'

/**
 * Format a Bible reference for display (e.g. "Genesis 12:1–3").
 */
export function formatReference(ref: BibleCharacterReference): string {
  const bookName = ESV_BOOK_NAMES[ref.bookId] ?? ref.bookId
  const versePart =
    ref.verse != null
      ? ref.endVerse != null && ref.endVerse !== ref.verse
        ? `${ref.verse}–${ref.endVerse}`
        : `${ref.verse}`
      : ''
  return versePart ? `${bookName} ${ref.chapter}:${versePart}` : `${bookName} ${ref.chapter}`
}

/** Book order (1–66) for sorting references; unknown books sort last. */
export function getBookOrder(bookId: string): number {
  const book = ESV_BOOKS.find((b) => b.id === bookId)
  return book?.order ?? 999
}

/** Sort references by canonical order (book, chapter, verse). */
export function sortReferences(refs: BibleCharacterReference[]): BibleCharacterReference[] {
  return [...refs].sort((a, b) => {
    const orderA = getBookOrder(a.bookId)
    const orderB = getBookOrder(b.bookId)
    if (orderA !== orderB) return orderA - orderB
    if (a.chapter !== b.chapter) return a.chapter - b.chapter
    return (a.verse ?? 0) - (b.verse ?? 0)
  })
}
