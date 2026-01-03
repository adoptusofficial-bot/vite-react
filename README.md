# JEE CBT Mock (Vite + React)

This is a self-contained mock CBT site for practice. No backend — everything is local JSON and localStorage.

## Run locally

1. Install dependencies:
   ```
   npm install
   ```
2. Run dev server:
   ```
   npm run dev
   ```

Open http://localhost:5173

## Login
Users are in `src/data/users.json` (username/password). Edit to add users.

## Questions
Questions are in `src/data/questions.json`. Edit to change questions. Format supports `mcq` (with `options` and `answer` as "A"/"B"/"C"/"D") and `integer` with `answer` string.

## Scoring
+4 correct, -1 incorrect, 0 skipped.

## Deploy to Vercel
Push to a git repo and connect to Vercel. Build command: `npm run build`, Output directory: `dist`.

