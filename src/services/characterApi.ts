import type { BibleCharacter } from '../types/character'
import { bibleCharacters } from '../data/bibleCharacters'

/**
 * Return all Bible characters from the local curated database.
 */
export function getCharacters(): BibleCharacter[] {
  return bibleCharacters
}

/**
 * Return one character by id, or undefined if not found.
 */
export function getCharacterById(id: string): BibleCharacter | undefined {
  return bibleCharacters.find((c) => c.id === id)
}
