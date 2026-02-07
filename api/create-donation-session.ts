/**
 * Creates a Stripe Checkout Session for one-time support/donations.
 * Set STRIPE_SECRET_KEY in Vercel project env (or .env for vercel dev).
 */

export const config = {
  runtime: 'nodejs',
}

function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

interface Body {
  amount_cents: number
  success_url: string
  cancel_url: string
}

export async function POST(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() })
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim()
  if (!secret) {
    return new Response(
      JSON.stringify({ error: 'Stripe is not configured on the server.' }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }

  let body: Body
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }

  const { amount_cents, success_url, cancel_url } = body
  if (
    typeof amount_cents !== 'number' ||
    amount_cents < 100 ||
    typeof success_url !== 'string' ||
    !success_url ||
    typeof cancel_url !== 'string' ||
    !cancel_url
  ) {
    return new Response(
      JSON.stringify({ error: 'Invalid amount (min 100 cents) or missing success_url/cancel_url' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(secret)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amount_cents,
            product_data: {
              name: 'Donation to Bible Study',
              description: 'One-time donation for the Bible study app.',
            },
          },
        },
      ],
      success_url,
      cancel_url,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }
}
