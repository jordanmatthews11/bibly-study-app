import { useState, useCallback, useEffect } from 'react'
import type { Card, ReviewState, UserProgress, ReviewRating } from '../types/flashcards'
import { getStarterKitById } from '../data/starterKits'

const STORAGE_KEY = 'bible-study-app-flashcards-v1'

export interface FlashcardData {
  cards: Card[]
  reviewByCardId: Record<string, Omit<ReviewState, 'cardId'>>
  progress: UserProgress
}

const defaultProgress: UserProgress = {
  totalPoints: 0,
  lastStudyDate: '',
  currentStreak: 0,
  badges: [],
}

function loadFlashcardData(): FlashcardData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FlashcardData>
      const progress = { ...defaultProgress, ...parsed.progress }
      progress.addedStarterKits = progress.addedStarterKits ?? []
      return {
        cards: parsed.cards ?? [],
        reviewByCardId: parsed.reviewByCardId ?? {},
        progress,
      }
    }
  } catch {
    // ignore
  }
  return { cards: [], reviewByCardId: {}, progress: { ...defaultProgress, addedStarterKits: [] } }
}

function saveFlashcardData(data: FlashcardData) {
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

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

const POINTS_AGAIN = 5
const POINTS_GOOD_OR_EASY = 10
const STREAK_BONUS_PER_DAY = 2

function nextIntervalMs(rating: ReviewRating, _intervalDays: number): number {
  const now = Date.now()
  switch (rating) {
    case 'again':
      return now + 60 * 1000 // 1 min
    case 'good':
      return now + 24 * 60 * 60 * 1000 // 1 day
    case 'easy':
      return now + 3 * 24 * 60 * 60 * 1000 // 3 days
    default:
      return now + 24 * 60 * 60 * 1000
  }
}

function nextIntervalDays(rating: ReviewRating): number {
  switch (rating) {
    case 'again':
      return 0
    case 'good':
      return 1
    case 'easy':
      return 3
    default:
      return 1
  }
}

function applyProgressBadges(
  prevProgress: UserProgress,
  prevCardCount: number,
  nextCards: Card[]
): UserProgress {
  let next = prevProgress
  if (prevCardCount === 0 && nextCards.length > 0 && !next.badges.includes('first_card')) {
    next = { ...next, badges: [...next.badges, 'first_card'] }
  }
  if (nextCards.length >= 10 && !next.badges.includes('cards_10')) {
    next = { ...next, badges: [...next.badges, 'cards_10'] }
  }
  if (nextCards.length >= 50 && !next.badges.includes('cards_50')) {
    next = { ...next, badges: [...next.badges, 'cards_50'] }
  }
  const totalVerses = nextCards.reduce((sum, c) => sum + (c.verseEnd - c.verseStart + 1), 0)
  if (totalVerses >= 100 && !next.badges.includes('verses_100')) {
    next = { ...next, badges: [...next.badges, 'verses_100'] }
  }
  return next
}

export function useFlashcards() {
  const [data, setData] = useState<FlashcardData>(loadFlashcardData)

  useEffect(() => {
    saveFlashcardData(data)
  }, [data])

  const addCards = useCallback((newCards: Omit<Card, 'id' | 'createdAt'>[]) => {
    const now = Date.now()
    setData((prev) => {
      const cardsToAdd: Card[] = newCards.map((c) => ({
        ...c,
        id: generateId(),
        createdAt: now,
      }))
      const nextCards = [...prev.cards, ...cardsToAdd]
      const nextProgress = applyProgressBadges(prev.progress, prev.cards.length, nextCards)
      return {
        ...prev,
        cards: nextCards,
        progress: nextProgress,
      }
    })
  }, [])

  const addStarterKit = useCallback((kitId: string) => {
    const kit = getStarterKitById(kitId)
    if (!kit) return
    setData((prev) => {
      const added = prev.progress.addedStarterKits ?? []
      if (added.includes(kitId)) return prev
      const now = Date.now()
      const cardsToAdd: Card[] = kit.verses.map((c) => ({
        ...c,
        id: generateId(),
        createdAt: now,
      }))
      const nextCards = [...prev.cards, ...cardsToAdd]
      let nextProgress = applyProgressBadges(prev.progress, prev.cards.length, nextCards)
      const addedStarterKits = [...(nextProgress.addedStarterKits ?? []), kitId]
      const badges = nextProgress.badges.includes(kit.badgeId)
        ? nextProgress.badges
        : [...nextProgress.badges, kit.badgeId]
      nextProgress = { ...nextProgress, addedStarterKits, badges }
      return {
        ...prev,
        cards: nextCards,
        progress: nextProgress,
      }
    })
  }, [])

  const deleteCard = useCallback((id: string) => {
    setData((prev) => {
      const nextReview = { ...prev.reviewByCardId }
      delete nextReview[id]
      return {
        ...prev,
        cards: prev.cards.filter((c) => c.id !== id),
        reviewByCardId: nextReview,
      }
    })
  }, [])

  const getDueCards = useCallback((): Card[] => {
    const now = Date.now()
    return data.cards
      .filter((card) => {
        const state = data.reviewByCardId[card.id]
        if (!state) return true
        return state.nextReviewAt <= now
      })
      .sort((a, b) => {
        const aAt = data.reviewByCardId[a.id]?.nextReviewAt ?? 0
        const bAt = data.reviewByCardId[b.id]?.nextReviewAt ?? 0
        return aAt - bAt
      })
  }, [data])

  const recordReview = useCallback(
    (cardId: string, rating: ReviewRating) => {
      const now = Date.now()
      const today = todayStr()
      setData((prev) => {
        const card = prev.cards.find((c) => c.id === cardId)
        if (!card) return prev
        const points =
          rating === 'again' ? POINTS_AGAIN : POINTS_GOOD_OR_EASY
        const streakBonus = prev.progress.currentStreak * STREAK_BONUS_PER_DAY
        const addedPoints = points + (rating !== 'again' ? streakBonus : 0)
        let newStreak = prev.progress.currentStreak
        const last = prev.progress.lastStudyDate
        if (last !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().slice(0, 10)
          if (last === yesterdayStr) newStreak += 1
          else newStreak = 1
        }
        let newBadges = [...prev.progress.badges]
        if (!newBadges.includes('first_review')) newBadges = [...newBadges, 'first_review']
        if (newStreak >= 3 && !newBadges.includes('streak_3')) newBadges = [...newBadges, 'streak_3']
        if (newStreak >= 7 && !newBadges.includes('streak_7')) newBadges = [...newBadges, 'streak_7']
        if (newStreak >= 30 && !newBadges.includes('streak_30')) newBadges = [...newBadges, 'streak_30']
        const nextReview: Record<string, Omit<ReviewState, 'cardId'>> = {
          ...prev.reviewByCardId,
          [cardId]: {
            nextReviewAt: nextIntervalMs(rating, 0),
            intervalDays: nextIntervalDays(rating),
            lastReviewedAt: now,
          },
        }
        return {
          ...prev,
          reviewByCardId: nextReview,
          progress: {
            ...prev.progress,
            totalPoints: prev.progress.totalPoints + addedPoints,
            lastStudyDate: today,
            currentStreak: newStreak,
            badges: newBadges,
          },
        }
      })
    },
    []
  )

  const getProgress = useCallback(
    (): UserProgress => data.progress,
    [data.progress]
  )

  return {
    cards: data.cards,
    reviewByCardId: data.reviewByCardId,
    progress: data.progress,
    addCards,
    addStarterKit,
    deleteCard,
    getDueCards,
    recordReview,
    getProgress,
  }
}
