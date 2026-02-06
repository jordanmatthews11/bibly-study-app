import { useState, useRef, useEffect } from 'react'
import { usePassageChat } from '../context/PassageChatContext'
import {
  sendChatMessage,
  type ChatContext as ApiChatContext,
  type PassageRef,
  type SelectedVerse,
} from '../services/chatApi'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function buildChatContext(
  passageContext: ReturnType<typeof usePassageChat>['passageContext']
): ApiChatContext {
  if (!passageContext) {
    return { passageRef: null, passageSnippet: '', selectedVerses: [] }
  }
  const passageRef: PassageRef = {
    bookId: passageContext.bookId,
    bookName: passageContext.bookName,
    chapter: passageContext.chapter,
  }
  const passageSnippet =
    passageContext.parsedVerses
      .slice(0, 20)
      .map((v) => `[${v.number}] ${v.text}`)
      .join(' ')
      .slice(0, 500) + (passageContext.parsedVerses.length > 20 ? '…' : '')
  const selectedVerses: SelectedVerse[] = passageContext.parsedVerses
    .filter((v) => passageContext.selectedVerseNumbers.includes(v.number))
    .map((v) => ({ number: v.number, text: v.text }))
  return { passageRef, passageSnippet, selectedVerses }
}

export default function ChatPanel() {
  const { passageContext } = usePassageChat()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setSending(true)
    const apiContext = buildChatContext(passageContext)
    try {
      const reply = await sendChatMessage(apiContext, text)
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Something went wrong. Try again.' },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-stone-800 text-white shadow-lg hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600"
        aria-label={open ? 'Close chat' : 'Open Bible chat'}
        title="Bible chat"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-30 flex w-full max-w-md flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900"
          style={{ height: 'min(420px, 60vh)' }}
        >
          <div className="border-b border-stone-200 px-3 py-2 dark:border-stone-700">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Bible chat
            </h2>
            {passageContext ? (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {passageContext.bookName} {passageContext.chapter}
                {passageContext.selectedVerseNumbers.length > 0 &&
                  ` · ${passageContext.selectedVerseNumbers.length} selected`}
              </p>
            ) : (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Open a passage to ask about it
              </p>
            )}
          </div>
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-3 space-y-3"
          >
            {messages.length === 0 && (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Ask a question about the passage or verses. Your current passage and selection are
                sent with each message.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg px-3 py-2 text-sm ${
                  m.role === 'user'
                    ? 'ml-8 bg-stone-200 text-stone-900 dark:bg-stone-700 dark:text-stone-100'
                    : 'mr-8 bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'
                }`}
              >
                <span className="whitespace-pre-wrap">{m.content}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-200 p-2 dark:border-stone-700">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this passage…"
                className="flex-1 rounded border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
                disabled={sending}
                aria-label="Chat message"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded bg-stone-800 px-3 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 dark:bg-stone-700 dark:hover:bg-stone-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
