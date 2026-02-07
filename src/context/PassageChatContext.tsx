import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { ParsedVerse } from '../utils/parseEsvVerses'

export interface PassageContextValue {
  bookId: string
  bookName: string
  chapter: number
  parsedVerses: ParsedVerse[]
  selectedVerseNumbers: number[]
}

const PassageChatContext = createContext<{
  passageContext: PassageContextValue | null
  setPassageContext: (ctx: PassageContextValue | null) => void
  chatOpen: boolean
  setChatOpen: (open: boolean) => void
  pendingPrompt: string | null
  setPendingPrompt: (p: string | null) => void
} | null>(null)

export function PassageChatProvider({ children }: { children: ReactNode }) {
  const [passageContext, setPassageContext] = useState<PassageContextValue | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)
  const setter = useCallback((ctx: PassageContextValue | null) => setPassageContext(ctx), [])
  return (
    <PassageChatContext.Provider
      value={{
        passageContext,
        setPassageContext: setter,
        chatOpen,
        setChatOpen,
        pendingPrompt,
        setPendingPrompt,
      }}
    >
      {children}
    </PassageChatContext.Provider>
  )
}

export function usePassageChat() {
  const ctx = useContext(PassageChatContext)
  if (!ctx) throw new Error('usePassageChat must be used within PassageChatProvider')
  return ctx
}
