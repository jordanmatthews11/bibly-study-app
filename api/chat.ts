/**
 * Vercel serverless proxy for the OpenAI Chat Completions API.
 * Keeps OPENAI_API_KEY on the server; frontend calls this instead of api.openai.com.
 * Set OPENAI_API_KEY in Vercel project env (or .env for vercel dev).
 */

export const config = {
  runtime: 'nodejs',
}

interface PassageRef {
  bookId: string
  bookName: string
  chapter: number
}

interface SelectedVerse {
  number: number
  text: string
}

interface ChatContext {
  passageRef: PassageRef | null
  passageSnippet: string
  selectedVerses: SelectedVerse[]
}

interface ChatMessagePayload {
  role: 'system' | 'user' | 'assistant'
  content: string
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function buildSystemPrompt(context: ChatContext): string {
  if (!context.passageRef && !context.passageSnippet && context.selectedVerses.length === 0) {
    return 'You are a helpful Bible study assistant. The user has not opened a passage yet. Encourage them to open a chapter from the Bible reader, or answer general Bible questions.'
  }
  const parts: string[] = [
    'You are a helpful Bible study assistant. Answer questions about the passage and verses the user has open.',
  ]
  if (context.passageRef) {
    parts.push(`Current passage: ${context.passageRef.bookName} chapter ${context.passageRef.chapter}.`)
  }
  if (context.passageSnippet) {
    parts.push(`Passage text:\n${context.passageSnippet}`)
  }
  if (context.selectedVerses.length > 0) {
    parts.push(
      `Selected verses:\n${context.selectedVerses.map((v) => `[${v.number}] ${v.text}`).join('\n')}`
    )
  }
  return parts.join('\n\n')
}

export async function POST(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured on server.' }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }

  let body: { context: ChatContext; messages: ChatMessagePayload[] }
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }

  const { context, messages } = body
  if (!context || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid context or messages' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }

  const systemPrompt = buildSystemPrompt(context)
  const apiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m: ChatMessagePayload) => ({
      role: m.role as 'user' | 'assistant',
      content: String(m.content || ''),
    })),
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: apiMessages,
    }),
  })

  const data = await res.json().catch(() => ({}))
  const headers = { 'Content-Type': 'application/json', ...corsHeaders() }

  if (!res.ok) {
    const errorMessage = data.error?.message || data.error || JSON.stringify(data) || res.statusText
    return new Response(
      JSON.stringify({ error: `OpenAI API error ${res.status}`, detail: errorMessage }),
      { status: res.status >= 500 ? 502 : res.status, headers }
    )
  }

  const content = data.choices?.[0]?.message?.content ?? ''
  return new Response(JSON.stringify({ content }), { status: 200, headers })
}
