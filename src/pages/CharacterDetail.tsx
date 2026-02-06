import { useParams, Link } from 'react-router-dom'
import { getCharacterById } from '../services/characterApi'
import { formatReference, sortReferences } from '../utils/formatReference'
import type { BibleCharacterReference } from '../types/character'

function refKey(ref: BibleCharacterReference): string {
  return `${ref.bookId}-${ref.chapter}-${ref.verse}`
}

function linkToVerse(ref: BibleCharacterReference): string {
  return `/bible/${ref.bookId}/${ref.chapter}${ref.verse != null ? `#v${ref.verse}` : ''}`
}

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const character = id ? getCharacterById(id) : undefined

  if (!id) {
    return (
      <div className="p-6">
        <Link to="/characters" className="text-warm-muted underline">
          Back to Characters
        </Link>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="mb-4 text-warm-text">
          Character not found.
        </p>
        <Link to="/characters" className="text-warm-muted underline">
          Back to Characters
        </Link>
      </div>
    )
  }

  const ref = character.reference
  const allPassages: BibleCharacterReference[] = []
  if (ref) allPassages.push(ref)
  if (character.passages) {
    for (const p of character.passages) {
      if (!ref || refKey(p) !== refKey(ref)) allPassages.push(p)
    }
  }
  const sortedPassages = sortReferences(allPassages)
  const storyBlocks = character.story ?? character.content
  const hasSignificance = character.significance?.length
  const hasLessons = character.lessons?.length

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <nav className="mb-4">
        <Link to="/characters" className="text-warm-muted underline">
          Characters
        </Link>
      </nav>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-warm-text">
          {character.name}
        </h1>
        {ref && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-warm-muted">
              Key reference: {formatReference(ref)}
            </span>
            <Link
              to={linkToVerse(ref)}
              className="rounded border border-warm-border bg-warm-surface px-3 py-1.5 text-sm font-medium hover:bg-warm-hover"
            >
              Open in Bible
            </Link>
          </div>
        )}
      </header>

      {sortedPassages.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-medium text-warm-text">
            Found in
          </h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {sortedPassages.map((p) => (
              <li key={refKey(p)}>
                <Link
                  to={linkToVerse(p)}
                  className="text-warm-muted underline hover:text-warm-text"
                >
                  {formatReference(p)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {storyBlocks.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-medium text-warm-text">
            Story
          </h2>
          <div className="space-y-2">
            {storyBlocks.map((paragraph, i) => (
              <p key={i} className="whitespace-pre-wrap text-warm-text">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {hasSignificance ? (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-medium text-warm-text">
            What makes them special
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-warm-text">
            {character.significance!.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasLessons ? (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-medium text-warm-text">
            What can be learned
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-warm-text">
            {character.lessons!.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
