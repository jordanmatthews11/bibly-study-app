export interface BibleCharacterReference {
  bookId: string
  chapter: number
  verse: number
  endVerse?: number
}

export interface BibleCharacter {
  id: string
  name: string
  reference: BibleCharacterReference | null
  content: string[]
}
