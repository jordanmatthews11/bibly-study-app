export interface VerseRef {
  bookId: string
  chapter: number
  verse?: number
  endVerse?: number
}

export interface Translation {
  id: string
  name: string
  englishName: string
  shortName: string
  language: string
  textDirection: 'ltr' | 'rtl'
  numberOfBooks: number
  totalNumberOfChapters: number
  totalNumberOfVerses: number
  listOfBooksApiLink?: string
}

export interface AvailableTranslations {
  translations: Translation[]
}

export interface TranslationBook {
  id: string
  name: string
  commonName: string
  title: string | null
  order: number
  numberOfChapters: number
  firstChapterNumber: number
  lastChapterNumber: number
  firstChapterApiLink: string
  lastChapterApiLink: string
  totalNumberOfVerses: number
}

export interface TranslationBooks {
  translation: Translation
  books: TranslationBook[]
}

export type ChapterContentItem =
  | { type: 'heading'; content: string[] }
  | { type: 'line_break' }
  | { type: 'verse'; number: number; content: (string | { text: string; wordsOfJesus?: boolean } | { noteId: number })[] }
  | { type: 'hebrew_subtitle'; content: unknown[] }

export interface ChapterData {
  number: number
  content: ChapterContentItem[]
  footnotes?: { noteId: number; text: string; reference?: { chapter: number; verse: number }; caller: string | null }[]
}

export interface TranslationBookChapter {
  translation: Translation
  book: TranslationBook
  thisChapterLink: string
  nextChapterApiLink: string | null
  previousChapterApiLink: string | null
  numberOfVerses: number
  chapter: ChapterData
}

function textFromContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (content && typeof content === 'object' && 'text' in content && typeof (content as { text: string }).text === 'string') {
    return (content as { text: string }).text
  }
  return ''
}

export function getVerseText(chapterData: ChapterData, verseNumber: number): string {
  const verse = chapterData.content.find(
    (c): c is Extract<ChapterContentItem, { type: 'verse' }> =>
      c.type === 'verse' && c.number === verseNumber
  )
  if (!verse) return ''
  const parts = verse.content.map(textFromContent).filter(Boolean)
  return parts.join(' ').trim()
}

export function getAllVerseTexts(chapterData: ChapterData): { verse: number; text: string }[] {
  return chapterData.content
    .filter((c): c is Extract<ChapterContentItem, { type: 'verse' }> => c.type === 'verse')
    .map((v) => ({ verse: v.number, text: v.content.map(textFromContent).join(' ').trim() }))
}
