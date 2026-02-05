import { useParams, Link } from 'react-router-dom'
import { getCharacterById } from '../services/characterApi'

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>()
  const character = id ? getCharacterById(id) : undefined

  if (!id) {
    return (
      <div className="p-6">
        <Link to="/characters" className="text-stone-600 underline dark:text-stone-400">
          Back to Characters
        </Link>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <p className="mb-4 text-stone-700 dark:text-stone-300">
          Character not found.
        </p>
        <Link to="/characters" className="text-stone-600 underline dark:text-stone-400">
          Back to Characters
        </Link>
      </div>
    )
  }

  const ref = character.reference

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <nav className="mb-4">
        <Link to="/characters" className="text-stone-600 underline dark:text-stone-400">
          Characters
        </Link>
      </nav>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          {character.name}
        </h1>
        {ref && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-stone-500 dark:text-stone-400">
              Key reference: {ref.bookId} {ref.chapter}:{ref.verse}
              {ref.endVerse && ref.endVerse !== ref.verse ? `–${ref.endVerse}` : ''}
            </span>
            <Link
              to={`/bible/${ref.bookId}/${ref.chapter}${ref.verse ? `#v${ref.verse}` : ''}`}
              className="rounded border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:hover:bg-stone-700"
            >
              Open in Bible
            </Link>
          </div>
        )}
      </header>
      <article className="prose prose-stone dark:prose-invert max-w-none">
        {character.content.map((paragraph, i) => (
          <p key={i} className="whitespace-pre-wrap text-stone-700 dark:text-stone-300">
            {paragraph}
          </p>
        ))}
      </article>
    </div>
  )
}
