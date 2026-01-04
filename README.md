# Pavied Client

A Next.js + TypeScript client for handling payments, onboarding, and Deriv integrations with Firebase-backed storage and a shared backend API.

---

## Table of contents
- **Project overview**
- **Features**
- **Tech stack**
- **Quick start**
- **Environment variables**
- **Scripts**
- **Security & best practices**
- **Directory overview**
- **Deployment**
- **Contributing & License**

---

## Project overview 🎯

**Pavied Telegram** is a web client built with the Next.js App Router. It provides user onboarding flows, bank & Deriv account linking, deposit/withdraw workflows (with Deriv verification), and file storage using Firebase.

The app talks to a shared backend API (via `SHARED_API_URL`) for Deriv-related workflows and uses NextAuth for Google OAuth.

---

## Features ✨
- Google OAuth sign-in and onboarding
- Bank account registration and selection
- Deposit and withdrawal flows with Deriv integration
- Firebase (Firestore + Storage) for persistent data and uploads
- Admin/shared API calls secured with a Bearer token
- Clean UI components and flows (Radix + Tailwind)

---

## Tech stack 🔧
- Next.js 15 (App Router) & React 19
- TypeScript
- Firebase Admin SDK for server-side operations
- NextAuth (Google provider)
- Tailwind CSS, Shadcn UI components
- @deriv-com/api-client for Deriv interactions
- Pino for logging, Biome for linting

---

## Quick start — Local development 🚀

1. Install dependencies

```bash
npm install
```

2. Copy or create a local env file

```bash
cp .env.example .env.local
# edit .env.local with your values
```

3. Start the dev server

```bash
npm run dev
# open http://localhost:3000
```

Build and run in production:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

---

## Important environment variables (examples) ⚙️
Create `.env.local` with the following keys (placeholders shown):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
SHARED_API_URL=https://example.shared.api
SHARED_API_TOKEN_CLIENT=your_shared_api_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DERIV_APP_ID=your_deriv_app_id
TOKEN_ENCRYPTION_KEY=your_32+_char_key
FIREBASE_SERVICE_ACCOUNT={...} # stringified JSON in production
LOG_LEVEL=info
```

> Note: In development the repo ships with `serviceAccountKey.json` for Firebase. In production use `FIREBASE_SERVICE_ACCOUNT` (stringified JSON) and never commit the service account file.

---

## Scripts
- `npm run dev` — run Next.js in development (turbopack)
- `npm run build` — production build
- `npm run start` — start server
- `npm run lint` — run Biome/eslint

---

## Security & best practices ⚠️
- **Never commit secrets** (e.g., `serviceAccountKey.json`, client secrets, or tokens). Rotate any leaked keys immediately.
- Use environment variables in production, and limit credential scopes.
- Use a strong `TOKEN_ENCRYPTION_KEY` for server-side encryption.

---

## Directory overview 📁
- `app/` — Next.js App Router pages & route handlers
- `components/` — UI components and flows (deposit, withdrawal, onboarding)
- `lib/` — API client, Firebase helpers, handlers, utilities
- `types/` — TypeScript types and declarations
- `firebase.config.ts` — Firebase admin initialization
- `auth.ts` — NextAuth configuration and callbacks

---

## Deployment 🛠️
- Vercel is recommended for Next.js apps, but any host that supports Node/Next can be used.
- Set production env vars on the host (e.g., `FIREBASE_SERVICE_ACCOUNT`, `SHARED_API_TOKEN_CLIENT`, `GOOGLE_CLIENT_SECRET`).

---

## Contributing & support 🤝
- Open issues or PRs for improvements.
- Follow the project style (TypeScript, Biome, Tailwind).
- For major changes, open a discussion or RFC.


