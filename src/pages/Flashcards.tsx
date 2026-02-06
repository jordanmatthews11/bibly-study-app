import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFlashcards } from '../hooks/useFlashcards'
import FlashcardReview from '../components/FlashcardReview'
import { STARTER_KITS } from '../data/starterKits'
import type { BadgeId } from '../types/flashcards'

const BADGE_LABELS: Record<BadgeId, string> = {
  first_card: 'First card',
  first_review: 'First review',
  streak_3: '3-day streak',
  streak_7: '7-day streak',
  streak_30: '30-day streak',
  cards_10: '10 cards',
  cards_50: '50 cards',
  verses_100: '100 verses',
  starter_salvation: 'Starter: Salvation',
  starter_peace: 'Starter: Peace',
  starter_strength: 'Starter: Strength',
  starter_faith: 'Starter: Faith',
  starter_love: 'Starter: Love',
  starter_scripture: 'Starter: Scripture',
  starter_prayer: 'Starter: Prayer',
  starter_hope: 'Starter: Hope',
  starter_trust: 'Starter: Trust',
  starter_new_life: 'Starter: New Life',
}

function formatNextReview(nextReviewAt: number): string {
  if (!nextReviewAt) return 'Due now'
  const d = new Date(nextReviewAt)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dDay = new Date(d)
  dDay.setHours(0, 0, 0, 0)
  if (dDay.getTime() <= today.getTime()) return 'Due now'
  if (dDay.getTime() === tomorrow.getTime()) return 'Due tomorrow'
  return `Due ${d.toLocaleDateString()}`
}

export default function Flashcards() {
  const { cards, reviewByCardId, progress, addStarterKit, deleteCard, getDueCards } = useFlashcards()
  const addedKits = progress.addedStarterKits ?? []
  const [sessionActive, setSessionActive] = useState(false)

  const dueCount = getDueCards().length

  if (sessionActive) {
    return (
      <FlashcardReview
        onDone={() => setSessionActive(false)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold text-stone-900 dark:text-stone-100">
        Flashcards
      </h1>

      <section className="mb-8 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/50">
        <h2 className="mb-3 text-lg font-medium text-stone-800 dark:text-stone-200">Dashboard</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="text-sm text-stone-500 dark:text-stone-400">Points</span>
            <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              {progress.totalPoints}
            </p>
          </div>
          <div>
            <span className="text-sm text-stone-500 dark:text-stone-400">Current streak</span>
            <p className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              {progress.currentStreak} {progress.currentStreak === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>
        {progress.badges.length > 0 && (
          <div className="mt-3">
            <span className="text-sm text-stone-500 dark:text-stone-400">Badges</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {progress.badges.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                >
                  {BADGE_LABELS[id]}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mb-8 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/50">
        <h2 className="mb-3 text-lg font-medium text-stone-800 dark:text-stone-200">Starter kits</h2>
        <p className="mb-3 text-sm text-stone-500 dark:text-stone-400">
          Add themed verse sets to your cards. Each kit awards a badge when added.
        </p>
        <ul className="space-y-3">
          {STARTER_KITS.map((kit) => {
            const added = addedKits.includes(kit.id)
            const verseCount = kit.verses.length
            return (
              <li
                key={kit.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white py-3 px-3 dark:border-stone-700 dark:bg-stone-800"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-900 dark:text-stone-100">{kit.label}</p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {verseCount} {verseCount === 1 ? 'verse' : 'verses'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {added ? (
                    <>
                      <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Added</span>
                      <span
                        className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                      >
                        {BADGE_LABELS[kit.badgeId]}
                      </span>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addStarterKit(kit.id)}
                      className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                    >
                      Add to my cards
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-medium text-stone-800 dark:text-stone-200">My cards</h2>
          <div className="flex items-center gap-2">
            {dueCount > 0 && (
              <button
                type="button"
                onClick={() => setSessionActive(true)}
                className="rounded bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                Study now ({dueCount} due)
              </button>
            )}
            <Link
              to="/bible"
              className="text-sm text-amber-700 underline dark:text-amber-400"
            >
              Add cards from Bible
            </Link>
          </div>
        </div>
        <p className="mb-3 text-sm text-stone-500 dark:text-stone-400">
          Select verses on a chapter page and click &quot;Add to flashcards&quot; to add cards.
        </p>
        {cards.length === 0 ? (
          <p className="rounded-lg border border-dashed border-stone-300 py-8 text-center text-stone-500 dark:border-stone-600 dark:text-stone-400">
            No cards yet. Open a Bible chapter, select verses, and add them to flashcards.
          </p>
        ) : (
          <ul className="space-y-2">
            {cards.map((card) => {
              const review = reviewByCardId[card.id]
              const nextReview = review ? formatNextReview(review.nextReviewAt) : 'Due now'
              return (
                <li
                  key={card.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white py-3 px-3 dark:border-stone-700 dark:bg-stone-800"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-900 dark:text-stone-100">
                      {card.referenceLabel}
                    </p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{nextReview}</p>
                  </div>
                  <div className="flex gap-2">
                    {dueCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setSessionActive(true)}
                        className="rounded border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700"
                      >
                        Study
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteCard(card.id)}
                      className="rounded border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
