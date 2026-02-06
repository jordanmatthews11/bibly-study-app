/**
 * Parse ESV passage text (with include-verse-numbers=true) into verse segments.
 * Pattern: [1], [2], etc. Verse number in brackets, then text until next bracket or end.
 */
export interface ParsedVerse {
  number: number
  text: string
}

export function parseEsvVerses(passageText: string): ParsedVerse[] {
  if (!passageText?.trim()) return []

  const regex = /\[(\d+)\]/g
  const matches: { index: number; length: number; number: number }[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(passageText)) !== null) {
    const number = parseInt(match[1], 10)
    if (!Number.isNaN(number)) {
      matches.push({ index: match.index, length: match[0].length, number })
    }
  }

  if (matches.length === 0) return []

  const verses: ParsedVerse[] = []
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].length
    const end = i + 1 < matches.length ? matches[i + 1].index : passageText.length
    const text = passageText.slice(start, end).trim()
    verses.push({ number: matches[i].number, text })
  }
  return verses
}
