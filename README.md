# Bible Study App

A web-first Bible Study app for reading and studying the Bible in the ESV: browse books and chapters, explore character profiles, and save bookmarks, highlights, and notes.

## Features

- **Bible reader** – Browse books (OT/NT), open chapters, read ESV text. Previous/next chapter navigation. Requires an ESV API key.
- **Bible chat** – Ask questions about the passage you have open. Powered by ChatGPT (OpenAI). Requires an OpenAI API key.
- **Search** – Verse-by-verse search is not available for ESV yet; use the Bible reader to browse.
- **Characters** – Browse a curated database of Bible characters with short profiles and key references. Open key references in the Bible reader.
- **Study** – Bookmark verses, highlight with colors, add notes. All stored in localStorage. Study page lists bookmarks, highlights, and notes with links to passages.
- **Donations** – Optional donations via the Donations page. Use an external URL (Venmo, Ko-fi, PayPal, etc.) and/or Stripe for one-time payments.

## Tech stack

- React 18 + TypeScript + Vite
- React Router, TanStack Query, Tailwind CSS
- [ESV API](https://api.esv.org/) (free key required) – get a key at [api.esv.org/account](https://api.esv.org/account/)

## Run locally

```bash
npm install
vercel dev
```

Open [http://localhost:5173](http://localhost:5173). Use `vercel dev` (not `npm run dev`) so the API routes (/api/esv, /api/chat) are available. Set ESV_API_KEY and OPENAI_API_KEY in `.env`.

## Build

```bash
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env` and set your API keys.

- **ESV_API_KEY** – Required for Bible reader. Get a free key at [api.esv.org/account](https://api.esv.org/account/). Set on server only (Vercel env or `.env` for `vercel dev`).
- **OPENAI_API_KEY** – Required for Bible chat. Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys). Set on server only (Vercel env or `.env` for `vercel dev`).
- **VITE_SUPPORT_URL** – Optional. External donations link (e.g. Venmo, Ko-fi, PayPal). Button label is derived from the URL. Shown on the Donations (/donate) page.
- **VITE_SUPPORT_STRIPE_ENABLED** – Optional. Set to `true` to show the one-time payment (Stripe) section on the Donations page. Leave unset for Venmo/external-link only.
- **STRIPE_SECRET_KEY** – Optional. For one-time payments on the Donations page. Set on server only. Requires `VITE_SUPPORT_STRIPE_ENABLED=true`. Get keys at [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys).

## Deploy on Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com), sign in, and click **Add New** → **Project**. Import your repo.
3. In **Environment Variables**, add:
   - **Name:** `ESV_API_KEY`  
     **Value:** your ESV API key
   - **Name:** `OPENAI_API_KEY`  
     **Value:** your OpenAI API key  
   (Add them for Production, Preview, and Development if you use Vercel previews.)
4. Click **Deploy**. Vercel will build and host the app and give you a URL (e.g. `https://your-app.vercel.app`).

To deploy from the CLI: install `vercel` (`npm i -g vercel`), run `vercel` in the project root, and add the env var in the Vercel dashboard under Project Settings → Environment Variables.
