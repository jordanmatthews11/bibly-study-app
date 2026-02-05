const BASE = import.meta.env.VITE_BIBLE_API_BASE ?? 'https://bible.helloao.org/api'
const DATASET = 'open-cross-ref'

export interface CrossRefRef {
  book: string
  chapter: number
  verse: number
  endVerse?: number
  score?: number
}

export interface CrossRefVerse {
  verse: number
  references: CrossRefRef[]
}

export interface CrossRefChapter {
  dataset: { id: string; name: string }
  book: { id: string; order: number }
  chapter: { number: number; content: CrossRefVerse[] }
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json() as Promise<T>
}

export async function getCrossReferences(
  bookId: string,
  chapterNum: number
): Promise<CrossRefChapter> {
  return fetchJson<CrossRefChapter>(
    `${BASE}/d/${DATASET}/${bookId}/${chapterNum}.json`
  )
}
