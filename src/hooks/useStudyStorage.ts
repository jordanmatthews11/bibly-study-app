import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'bible-study-app-v1'

export interface Bookmark {
  id: string
  bookId: string
  chapter: number
  verse?: number
  label?: string
  createdAt: number
}

export interface Highlight {
  id: string
  bookId: string
  chapter: number
  verse: number
  color: 'yellow' | 'green' | 'blue' | 'red'
  createdAt: number
}

export interface Note {
  id: string
  bookId: string
  chapter: number
  verse: number
  content: string
  createdAt: number
  updatedAt: number
}

export interface StudyData {
  bookmarks: Bookmark[]
  highlights: Highlight[]
  notes: Note[]
}

const defaultData: StudyData = {
  bookmarks: [],
  highlights: [],
  notes: [],
}

function loadStudyData(): StudyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StudyData>
      return {
        bookmarks: parsed.bookmarks ?? defaultData.bookmarks,
        highlights: parsed.highlights ?? defaultData.highlights,
        notes: parsed.notes ?? defaultData.notes,
      }
    }
  } catch {
    // ignore
  }
  return defaultData
}

function saveStudyData(data: StudyData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

function generateId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useStudy() {
  const [data, setData] = useState<StudyData>(loadStudyData)

  useEffect(() => {
    saveStudyData(data)
  }, [data])

  const addBookmark = useCallback(
    (bookId: string, chapter: number, verse?: number, label?: string) => {
      setData((prev) => ({
        ...prev,
        bookmarks: [
          ...prev.bookmarks,
          {
            id: generateId(),
            bookId,
            chapter,
            verse,
            label,
            createdAt: Date.now(),
          },
        ],
      }))
    },
    []
  )

  const removeBookmark = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.id !== id),
    }))
  }, [])

  const hasBookmark = useCallback(
    (bookId: string, chapter: number, verse?: number) => {
      return data.bookmarks.some(
        (b) =>
          b.bookId === bookId &&
          b.chapter === chapter &&
          (verse == null || b.verse === verse)
      )
    },
    [data.bookmarks]
  )

  const getBookmark = useCallback(
    (bookId: string, chapter: number, verse?: number): Bookmark | undefined => {
      return data.bookmarks.find(
        (b) =>
          b.bookId === bookId &&
          b.chapter === chapter &&
          (verse == null || b.verse === verse)
      )
    },
    [data.bookmarks]
  )

  const addHighlight = useCallback(
    (bookId: string, chapter: number, verse: number, color: Highlight['color']) => {
      setData((prev) => ({
        ...prev,
        highlights: [
          ...prev.highlights.filter(
            (h) => !(h.bookId === bookId && h.chapter === chapter && h.verse === verse)
          ),
          {
            id: generateId(),
            bookId,
            chapter,
            verse,
            color,
            createdAt: Date.now(),
          },
        ],
      }))
    },
    []
  )

  const removeHighlight = useCallback(
    (bookId: string, chapter: number, verse: number) => {
      setData((prev) => ({
        ...prev,
        highlights: prev.highlights.filter(
          (h) => !(h.bookId === bookId && h.chapter === chapter && h.verse === verse)
        ),
      }))
    },
    []
  )

  const getHighlight = useCallback(
    (bookId: string, chapter: number, verse: number): Highlight | undefined => {
      return data.highlights.find(
        (h) => h.bookId === bookId && h.chapter === chapter && h.verse === verse
      )
    },
    [data.highlights]
  )

  const addNote = useCallback(
    (bookId: string, chapter: number, verse: number, content: string) => {
      const now = Date.now()
      setData((prev) => {
        const existing = prev.notes.find(
          (n) =>
            n.bookId === bookId && n.chapter === chapter && n.verse === verse
        )
        if (existing) {
          return {
            ...prev,
            notes: prev.notes.map((n) =>
              n.id === existing.id
                ? { ...n, content, updatedAt: now }
                : n
            ),
          }
        }
        return {
          ...prev,
          notes: [
            ...prev.notes,
            {
              id: generateId(),
              bookId,
              chapter,
              verse,
              content,
              createdAt: now,
              updatedAt: now,
            },
          ],
        }
      })
    },
    []
  )

  const removeNote = useCallback(
    (bookId: string, chapter: number, verse: number) => {
      setData((prev) => ({
        ...prev,
        notes: prev.notes.filter(
          (n) =>
            !(n.bookId === bookId && n.chapter === chapter && n.verse === verse)
        ),
      }))
    },
    []
  )

  const getNote = useCallback(
    (bookId: string, chapter: number, verse: number): Note | undefined => {
      return data.notes.find(
        (n) =>
          n.bookId === bookId && n.chapter === chapter && n.verse === verse
      )
    },
    [data.notes]
  )

  return {
    bookmarks: data.bookmarks,
    highlights: data.highlights,
    notes: data.notes,
    addBookmark,
    removeBookmark,
    hasBookmark,
    getBookmark,
    addHighlight,
    removeHighlight,
    getHighlight,
    addNote,
    removeNote,
    getNote,
  }
}
