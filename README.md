# Bible Study App

A web-first Bible Study app for reading and studying the Bible in the ESV: browse books and chapters, explore character profiles, and save bookmarks, highlights, and notes.

## Features

- **Bible reader** – Browse books (OT/NT), open chapters, read ESV text. Previous/next chapter navigation. Requires an ESV API key.
- **Search** – Verse-by-verse search is not available for ESV yet; use the Bible reader to browse.
- **Characters** – Browse a curated database of Bible characters with short profiles and key references. Open key references in the Bible reader.
- **Study** – Bookmark verses, highlight with colors, add notes. All stored in localStorage. Study page lists bookmarks, highlights, and notes with links to passages.

## Tech stack

- React 18 + TypeScript + Vite
- React Router, TanStack Query, Tailwind CSS
- [ESV API](https://api.esv.org/) (free key required) – get a key at [api.esv.org/account](https://api.esv.org/account/)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env` and set your ESV API key.

- **VITE_ESV_API_KEY** – Required. Get a free key at [api.esv.org/account](https://api.esv.org/account/). Restart the dev server after adding it.

## Deploy on Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com), sign in, and click **Add New** → **Project**. Import your repo.
3. In **Environment Variables**, add:
   - **Name:** `VITE_ESV_API_KEY`
   - **Value:** your ESV API key  
   (Add it for Production, Preview, and Development if you use Vercel previews.)
4. Click **Deploy**. Vercel will build and host the app and give you a URL (e.g. `https://your-app.vercel.app`).

To deploy from the CLI: install `vercel` (`npm i -g vercel`), run `vercel` in the project root, and add the env var in the Vercel dashboard under Project Settings → Environment Variables.
