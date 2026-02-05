import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'

const Bible = lazy(() => import('./pages/Bible'))
const BibleChapter = lazy(() => import('./pages/BibleChapter'))
const Search = lazy(() => import('./pages/Search'))
const Characters = lazy(() => import('./pages/Characters'))
const CharacterDetail = lazy(() => import('./pages/CharacterDetail'))
const Study = lazy(() => import('./pages/Study'))

function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/bible" replace />} />
          <Route path="/bible" element={<Bible />} />
          <Route path="/bible/:bookId/:chapter" element={<BibleChapter />} />
          <Route path="/search" element={<Search />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
          <Route path="/study" element={<Study />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App
