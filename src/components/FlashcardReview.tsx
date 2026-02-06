import { useState, useMemo, useCallback } from 'react'
import { useFlashcards } from '../hooks/useFlashcards'
import type { Card, ReviewRating } from '../types/flashcards'

const POINTS_AGAIN = 5
const POINTS_GOOD_OR_EASY = 10
const STREAK_BONUS_PER_DAY = 2

export default function FlashcardReview({ onDone }: { onDone: () => void }) {
  const { getDueCards, recordReview, progress } = useFlashcards()
  const dueCards = useMemo(() => getDueCards(), [getDueCards])
  const [queue] = useState<Card[]>(() => [...dueCards])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [sessionReviewed, setSessionReviewed] = useState(0)
  const [sessionPoints, setSessionPoints] = useState(0)

  const currentCard = queue[currentIndex]
  const isDone = queue.length === 0 || currentIndex >= queue.length

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      if (!currentCard) return
      const points =
        rating === 'again'
          ? POINTS_AGAIN
          : POINTS_GOOD_OR_EASY + progress.currentStreak * STREAK_BONUS_PER_DAY
      recordReview(currentCard.id, rating)
      setSessionReviewed((n) => n + 1)
      setSessionPoints((p) => p + points)
      setShowBack(false)
      setCurrentIndex((i) => i + 1)
    },
    [currentCard, progress.currentStreak, recordReview]
  )

  if (isDone) {
    const hadNoCards = queue.length === 0 && sessionReviewed === 0
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-6 dark:border-stone-700 dark:bg-stone-800/50">
          <h2 className="mb-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
            {hadNoCards ? 'No cards due' : 'Session complete'}
          </h2>
          <p className="text-stone-700 dark:text-stone-300">
            {hadNoCards
              ? 'All caught up! Add more cards or come back later.'
              : `Reviewed ${sessionReviewed} ${sessionReviewed === 1 ? 'card' : 'cards'}${
                  sessionPoints > 0 ? ` · +${sessionPoints} points` : ''
                }`}
          </p>
          <button
            type="button"
            onClick={onDone}
            className="mt-6 rounded bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            Back to Flashcards
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-4 flex items-center justify-between text-sm text-stone-500 dark:text-stone-400">
        <span>
          Card {currentIndex + 1} of {queue.length}
        </span>
        <button
          type="button"
          onClick={onDone}
          className="text-amber-700 underline dark:text-amber-400"
        >
          End session
        </button>
      </div>
      <div
        className="min-h-[200px] rounded-xl border-2 border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-800"
        role="region"
        aria-label={showBack ? 'Answer' : 'Question'}
      >
        {showBack ? (
          <p className="whitespace-pre-wrap text-stone-800 dark:text-stone-200">
            {currentCard.text}
          </p>
        ) : (
          <p className="text-xl font-medium text-stone-900 dark:text-stone-100">
            {currentCard.referenceLabel}
          </p>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {!showBack ? (
          <button
            type="button"
            onClick={() => setShowBack(true)}
            className="w-full rounded-lg bg-amber-500 py-3 font-medium text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            Show answer
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleRate('again')}
              className="flex-1 min-w-[80px] rounded-lg border-2 border-red-300 bg-red-50 py-3 font-medium text-red-800 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50"
            >
              Again
            </button>
            <button
              type="button"
              onClick={() => handleRate('good')}
              className="flex-1 min-w-[80px] rounded-lg border-2 border-amber-300 bg-amber-50 py-3 font-medium text-amber-900 hover:bg-amber-100 dark:border-amber-600 dark:bg-amber-900/30 dark:hover:bg-amber-900/50"
            >
              Good
            </button>
            <button
              type="button"
              onClick={() => handleRate('easy')}
              className="flex-1 min-w-[80px] rounded-lg border-2 border-green-300 bg-green-50 py-3 font-medium text-green-800 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50"
            >
              Easy
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
