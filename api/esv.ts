/**
 * Vercel serverless proxy for the ESV API.
 * Keeps ESV_API_KEY on the server; frontend calls this instead of api.esv.org.
 * Set ESV_API_KEY in Vercel project env (or .env for vercel dev).
 */

const ESV_BASE = 'https://api.esv.org'

export const config = {
  runtime: 'nodejs',
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export async function GET(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status:204, headers: corsHeaders() })
  }

  const key = process.env.ESV_API_KEY?.trim()
  if (!key) {
    return new Response(
      JSON.stringify({ error: 'ESV API key not configured on server.' }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }

  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  if (!q || !q.trim()) {
    return new Response(
      JSON.stringify({ error: 'Missing or empty query parameter: q' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }

  const esvUrl = `${ESV_BASE}/v3/passage/text/?q=${encodeURIComponent(q.trim())}&include-verse-numbers=true&include-headings=true&include-footnotes=false&include-short-copyright=true`
  const res = await fetch(esvUrl, {
    headers: { Authorization: `Token ${key}` },
  })

  const text = await res.text()
  const headers = { 'Content-Type': 'application/json', ...corsHeaders() }
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: `ESV API error ${res.status}`, detail: text }),
      { status: res.status >= 500 ? 502 : res.status, headers }
    )
  }
  return new Response(text, { status: 200, headers })
}
