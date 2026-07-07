# Mike S Ncube — Portfolio

Personal portfolio for an AI Engineer building production RAG, agentic AI, and LLM backend systems. Built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Features

- **RAG chat assistant** (`/api/chat`) — visitor questions are embedded with `gemini-embedding-001`, matched by cosine similarity against a curated knowledge base (`lib/knowledge.ts`) built from real project documentation, and answered by `gemini-2.5-flash` grounded in the retrieved chunks. Answers cite sources; out-of-scope questions are refused honestly.
- **Contact form** (`/api/contact`) — sends real email via Resend, with validation, HTML escaping, and rate limiting.
- **Live GitHub projects** (`/api/github`) — project cards pulled from the GitHub API, revalidated hourly.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in the keys below
npm run dev
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | For chat | Embeddings + generation ([get one](https://aistudio.google.com/apikey)) |
| `RESEND_API_KEY` | For contact form | Sending email ([get one](https://resend.com/api-keys)) |
| `CONTACT_TO_EMAIL` | Optional | Contact-form recipient (defaults to Mike's email) |
| `CONTACT_FROM_EMAIL` | Optional | Sender identity (defaults to Resend onboarding sender) |

Without keys, both endpoints fail honestly with a 503 and direct visitors to email instead — nothing on the site pretends to work.

## Quality gates

```bash
npx tsc --noEmit   # must exit 0
npm run build      # must succeed
```

## Updating the assistant's knowledge

Edit `lib/knowledge.ts`. Every chunk must be sourced from real, verifiable material (repo READMEs, the portfolio itself) and carry a `sourceUrl`. Embeddings are computed at runtime and cached per server instance — no build step needed.
