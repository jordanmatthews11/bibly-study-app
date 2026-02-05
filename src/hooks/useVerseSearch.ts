import { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useApp } from '../context/AppContext'
import { getBooks, getChapter } from '../services/bibleApi'
import { getAllVerseTexts } from '../types/bible'

export interface SearchResult {
  bookId: string
  bookName: string
  chapter: number
  verse: number
  text: string
  snippet: string
}

const SNIPPET_LENGTH = 80

function snippet(text: string, query: string): string {
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  const idx = lower.indexOf(q)
  if (idx < 0) return text.slice(0, SNIPPET_LENGTH) + (text.length > SNIPPET_LENGTH ? '…' : '')
  const start = Math.max(0, idx - 30)
  const end = Math.min(text.length, idx + query.length + 50)
  const s = text.slice(start, end)
  return (start > 0 ? '…' : '') + s + (end < text.length ? '…' : '')
}

export function useVerseSearch(query: string, bookIdFilter: string | null) {
  const { translationId } = useApp()
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const { data: booksData } = useQuery({
    queryKey: ['books', translationId],
    queryFn: () => getBooks(translationId),
  })

  const books = booksData?.books ?? []
  const booksToSearch = useMemo(() => {
    if (translationId === 'ESV') return [] // ESV search not implemented; use passage search at api.esv.org
    if (!bookIdFilter) return books
    return books.filter((b) => b.id === bookIdFilter)
  }, [books, bookIdFilter, translationId])

  const runSearch = useCallback(async () => {
    if (!query.trim() || booksToSearch.length === 0) {
      setResults([])
      return
    }
    setSearching(true)
    const found: SearchResult[] = []
    const q = query.trim().toLowerCase()
    for (const book of booksToSearch) {
      for (let ch = 1; ch <= book.numberOfChapters; ch++) {
        try {
          const chapterData = await getChapter(translationId, book.id, ch)
          const verses = getAllVerseTexts(chapterData.chapter)
          for (const { verse: vNum, text } of verses) {
            if (text.toLowerCase().includes(q)) {
              found.push({
                bookId: book.id,
                bookName: book.commonName,
                chapter: ch,
                verse: vNum,
                text,
                snippet: snippet(text, query),
              })
            }
          }
        } catch {
          // skip chapter on error
        }
      }
    }
    setResults(found)
    setSearching(false)
  }, [query, translationId, booksToSearch])

  return { results, searching, runSearch, books }
}
