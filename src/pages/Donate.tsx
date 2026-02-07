import { useState } from 'react'

const SUPPORT_URL = import.meta.env.VITE_SUPPORT_URL?.trim() || ''
const STRIPE_ENABLED = import.meta.env.VITE_SUPPORT_STRIPE_ENABLED === 'true'

function getSupportLabel(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes('venmo')) return 'Donate via Venmo'
  if (lower.includes('ko-fi')) return 'Donate via Ko-fi'
  if (lower.includes('paypal')) return 'Donate via PayPal'
  return 'Donate'
}

export default function Donate() {
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveCents = customAmount ? Math.round(parseFloat(customAmount) * 100) : null

  async function handleStripeDonate() {
    if (effectiveCents == null || effectiveCents < 100) {
      setError('Please enter an amount (minimum $1).')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const origin = window.location.origin
      const res = await fetch('/api/create-donation-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: effectiveCents,
          success_url: `${origin}/donate?success=1`,
          cancel_url: `${origin}/donate`,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Could not start payment.')
        setLoading(false)
        return
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError('No payment link received.')
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  const searchParams = new URLSearchParams(window.location.search)
  const success = searchParams.get('success') === '1'

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-2 text-2xl font-semibold text-warm-text">Donations</h1>
      <p className="mb-6 text-warm-muted">
        One-time support helps keep this Bible study app free. This is not a tax-deductible donation to a charity.
      </p>

      {success && (
        <div className="mb-6 rounded border border-green-600/40 bg-green-500/10 px-4 py-3 text-green-800 dark:text-green-200">
          Thank you for your support.
        </div>
      )}

      {SUPPORT_URL && (
        <div className="mb-6">
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-warm-accent px-4 py-2 font-medium text-white hover:opacity-90"
          >
            {getSupportLabel(SUPPORT_URL)}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          {STRIPE_ENABLED && (
            <p className="mt-3 text-sm text-warm-muted">Or use a one-time payment below.</p>
          )}
        </div>
      )}

      {STRIPE_ENABLED && (
        <div className="rounded border border-warm-border bg-warm-surface p-4">
        <p className="mb-3 text-sm font-medium text-warm-text">One-time payment</p>
        <div className="mb-4">
          <label htmlFor="custom-amount" className="mb-1 block text-sm text-warm-muted">
            Amount ($)
          </label>
          <input
            id="custom-amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 10"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full max-w-[120px] rounded border border-warm-border bg-warm-bg px-3 py-2 text-warm-text"
          />
        </div>
        {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="button"
          onClick={handleStripeDonate}
          disabled={loading || effectiveCents == null || effectiveCents < 100}
          className="rounded bg-warm-accent px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Redirecting…' : effectiveCents != null && effectiveCents >= 100 ? `Donate $${(effectiveCents / 100).toFixed(2)}` : 'Donate'}
        </button>
        </div>
      )}

      {!SUPPORT_URL && import.meta.env.DEV && (
        <p className="mt-4 text-sm text-warm-muted">
          Optional: set VITE_SUPPORT_URL (e.g. Venmo, Ko-fi, PayPal). Set VITE_SUPPORT_STRIPE_ENABLED=true and STRIPE_SECRET_KEY on the server to show one-time payments.
        </p>
      )}
    </div>
  )
}
