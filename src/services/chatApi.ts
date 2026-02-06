/**
 * Chat API for the Bible chatbot. Context is what the bot "sees" (current passage and selection).
 * Placeholder implementation; replace with an LLM API (e.g. OpenAI) via env or backend later.
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

export async function sendChatMessage(context: ChatContext, userMessage: string): Promise<string> {
  // Placeholder: no external API. Return a message that acknowledges context.
  const refStr =
    context.passageRef != null
      ? `${context.passageRef.bookName} ${context.passageRef.chapter}`
      : 'none'
  const selectedCount = context.selectedVerses.length

  if (!userMessage.trim()) {
    return 'Ask a question about the passage or verses you have open. If you don\'t see a passage, open a chapter from the Bible reader.'
  }

  return `Context received. You asked: "${userMessage.trim()}"\n\n` +
    `Current passage: ${refStr}. Selected verses: ${selectedCount}. ` +
    `Connect an AI API (e.g. VITE_OPENAI_API_KEY or a serverless function) to get real answers about verses and passages.`
}
