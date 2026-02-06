import { Link } from 'react-router-dom'

export type BookListItem = { id: string; commonName: string; order: number }

const OT_LAST_ORDER = 39

export default function BookList({
  books,
}: {
  books: BookListItem[]
}) {
  const ot = books.filter((b) => b.order <= OT_LAST_ORDER)
  const nt = books.filter((b) => b.order > OT_LAST_ORDER)

  return (
    <nav className="flex flex-col gap-4" aria-label="Bible books">
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-warm-muted">
          Old Testament
        </h3>
        <ul className="flex flex-col gap-0.5">
          {ot.map((book) => (
            <li key={book.id}>
              <Link
                to={`/bible/${book.id}/1`}
                className="block rounded px-2 py-1.5 text-sm font-medium text-warm-text hover:bg-warm-hover"
              >
                {book.commonName}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-warm-muted">
          New Testament
        </h3>
        <ul className="flex flex-col gap-0.5">
          {nt.map((book) => (
            <li key={book.id}>
              <Link
                to={`/bible/${book.id}/1`}
                className="block rounded px-2 py-1.5 text-sm font-medium text-warm-text hover:bg-warm-hover"
              >
                {book.commonName}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  )
}
