export interface Card {
  id: string
  bookId: string
  chapter: number
  verseStart: number
  verseEnd: number
  referenceLabel: string
  text: string
  createdAt: number
}

export interface ReviewState {
  cardId: string
  nextReviewAt: number
  intervalDays: number
  lastReviewedAt: number
}

export interface UserProgress {
  totalPoints: number
  lastStudyDate: string
  currentStreak: number
  badges: BadgeId[]
  addedStarterKits?: string[]
}

export type BadgeId =
  | 'first_card'
  | 'first_review'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'cards_10'
  | 'cards_50'
  | 'verses_100'
  | 'starter_salvation'
  | 'starter_peace'
  | 'starter_strength'
  | 'starter_faith'
  | 'starter_love'
  | 'starter_scripture'
  | 'starter_prayer'
  | 'starter_hope'
  | 'starter_trust'
  | 'starter_new_life'

export type ReviewRating = 'again' | 'good' | 'easy'
