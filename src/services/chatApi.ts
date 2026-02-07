/**
 * Chat API for the Bible chatbot. Context is what the bot "sees" (current passage and selection).
 * Sends messages to the serverless proxy (/api/chat) which forwards to OpenAI.
 * Set OPENAI_API_KEY on the server (Vercel env or .env for vercel dev).
 */

export interface PassageRef {
  bookId: string
  bookName: string
  chapter: number
}

export interface SelectedVerse {
  number: number
  text: string
}

export interface ChatContext {
  passageRef: PassageRef | null
  passageSnippet: string
  selectedVerses: SelectedVerse[]
}

export interface ChatMessagePayload {
  role: 'user' | 'assistant'
  content: string
}

const CHAT_API = '/api/chat'

export async function sendChatMessage(
  context: ChatContext,
  userMessage: string,
  previousMessages: ChatMessagePayload[] = []
): Promise<string> {
  if (!userMessage.trim()) {
    return 'Ask a question about the passage or verses you have open. If you don\'t see a passage, open a chapter from the Bible reader.'
  }

  const messages: ChatMessagePayload[] = [
    ...previousMessages,
    { role: 'user' as const, content: userMessage.trim() },
  ]

  const res = await fetch(CHAT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, messages }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg =
      res.status === 502
        ? 'OpenAI API key not configured on server. Set OPENAI_API_KEY in Vercel (or .env for vercel dev).'
        : data.error || data.detail || res.statusText
    throw new Error(`Chat API error ${res.status}: ${msg}`)
  }

  const content = data.content
  if (typeof content !== 'string') {
    throw new Error('Invalid response from chat API')
  }

  return content
}
