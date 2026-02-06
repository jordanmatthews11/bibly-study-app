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

const STARTER_BADGES = new Set<string>([
  'starter_salvation', 'starter_peace', 'starter_strength', 'starter_faith',
  'starter_love', 'starter_scripture', 'starter_prayer', 'starter_hope',
  'starter_trust', 'starter_new_life',
])
const STREAK_BADGES = new Set<string>(['streak_3', 'streak_7', 'streak_30'])

function badgeVariant(id: BadgeId): string {
  if (STREAK_BADGES.has(id))
    return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
  if (STARTER_BADGES.has(id))
    return 'bg-warm-accent-subtle text-warm-accent'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 011 1v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V5h1a1 1 0 001-1V3a1 1 0 011-1h2a1 1 0 010 2h-1v2.586l1.293 1.293a1 1 0 101.414-1.414l-2-2a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L13 7.414V5h-1a1 1 0 00-1 1v1H5a1 1 0 00-1 1v7a2 2 0 002 2h8a2 2 0 002-2V8a1 1 0 00-1-1H5zm3 11a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
  )
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

  const badgeDisplayLimit = 8
  const visibleBadges = progress.badges.slice(0, badgeDisplayLimit)
  const remainingBadgeCount = Math.max(0, progress.badges.length - badgeDisplayLimit)

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-warm-text">
          Flashcards
        </h1>
        <div className="flex items-center gap-2">
          {dueCount > 0 && (
            <button
              type="button"
              onClick={() => setSessionActive(true)}
              className="inline-flex items-center gap-2 rounded bg-warm-accent px-4 py-2 text-sm font-medium text-white hover:bg-warm-accent-hover"
            >
              <PlayIcon className="h-4 w-4" />
              Study now ({dueCount} due)
            </button>
          )}
          <Link
            to="/bible"
            className="text-sm text-warm-accent underline"
          >
            Add cards from Bible
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <main className="min-w-0 flex-1">
          <section className="mb-6 rounded-lg border border-warm-border bg-warm-hover/50 p-4 dark:bg-warm-surface/50">
            <h2 className="mb-2 text-lg font-medium text-warm-text">Starter kits</h2>
            <p className="mb-3 text-xs text-warm-muted">
              Add themed verse sets. Each kit awards a badge when added.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {STARTER_KITS.map((kit) => {
                const added = addedKits.includes(kit.id)
                const verseCount = kit.verses.length
                return (
                  <div
                    key={kit.id}
                    className="flex flex-col justify-between gap-2 rounded-lg border border-warm-border bg-warm-surface p-2"
                  >
                    <div>
                      <p className="truncate text-sm font-medium text-warm-text">{kit.label}</p>
                      <p className="text-xs text-warm-muted">
                        {verseCount} {verseCount === 1 ? 'verse' : 'verses'}
                      </p>
                    </div>
                    <div>
                      {added ? (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badgeVariant(kit.badgeId)}`}
                        >
                          <TrophyIcon className="h-3 w-3" />
                          {BADGE_LABELS[kit.badgeId]}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addStarterKit(kit.id)}
                          className="w-full rounded bg-warm-accent px-2 py-1.5 text-xs font-medium text-white hover:bg-warm-accent-hover"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-lg font-medium text-warm-text">My cards</h2>
            <p className="mb-3 text-xs text-warm-muted">
              Select verses on a chapter page and click &quot;Add to flashcards&quot; to add cards.
            </p>
            {cards.length === 0 ? (
              <p className="rounded-lg border border-dashed border-warm-border py-6 text-center text-sm text-warm-muted">
                No cards yet. Open a Bible chapter, select verses, and add them to flashcards.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => {
                  const review = reviewByCardId[card.id]
                  const nextReview = review ? formatNextReview(review.nextReviewAt) : 'Due now'
                  return (
                    <div
                      key={card.id}
                      className="flex flex-col gap-2 rounded-lg border border-warm-border bg-warm-surface py-2 px-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-warm-text">
                          {card.referenceLabel}
                        </p>
                        <p className="text-xs text-warm-muted">{nextReview}</p>
                      </div>
                      <div className="mt-auto flex gap-1">
                        {dueCount > 0 && (
                          <button
                            type="button"
                            onClick={() => setSessionActive(true)}
                            className="rounded border border-warm-border bg-warm-surface px-2 py-1 text-xs font-medium hover:bg-warm-hover"
                          >
                            Study
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteCard(card.id)}
                          className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </main>

        <aside className="w-full shrink-0 lg:w-64">
          <div className="sticky top-20 rounded-lg border border-warm-border bg-warm-surface p-4">
            <h3 className="mb-2 text-sm font-medium text-warm-text">Points</h3>
            <p className="mb-4 flex items-center gap-1.5 text-2xl font-semibold text-warm-text">
              <StarIcon className="h-5 w-5 text-warm-accent" />
              {progress.totalPoints} pts
            </p>
            <h3 className="mb-2 text-sm font-medium text-warm-text">Streak</h3>
            <p className="mb-4 flex items-center gap-1.5 text-2xl font-semibold text-warm-text">
              <FlameIcon className="h-5 w-5 text-orange-500" />
              {progress.currentStreak} {progress.currentStreak === 1 ? 'day' : 'days'}
            </p>
            {progress.badges.length > 0 && (
              <>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-warm-text">
                  <TrophyIcon className="h-4 w-4 text-warm-accent" />
                  Badges
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {visibleBadges.map((id) => (
                    <span
                      key={id}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badgeVariant(id)}`}
                    >
                      {BADGE_LABELS[id]}
                    </span>
                  ))}
                  {remainingBadgeCount > 0 && (
                    <span className="text-xs text-warm-muted">
                      +{remainingBadgeCount}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
