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
  /** All major passages where the character appears (for "Found in" section). */
  passages?: BibleCharacterReference[]
  /** Narrative; detail page falls back to content if absent. */
  story?: string[]
  /** What makes them special (theological/historical importance). */
  significance?: string[]
  /** What can be learned (application, takeaways). */
  lessons?: string[]
}
