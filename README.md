# ViewGram

A dead-simple Instagram profile planner. No signup, no data leaving your browser, just drag, drop and preview.

I built this because I got tired of guessing how my grid would look after posting. Now I can upload drafts, shuffle them around, and see the whole thing before anything goes live.

## What it does

- Edit your profile picture, username, bio, link and stats
- Add posts by URL or drag-and-drop upload
- Reorder your grid with drag and drop
- Click any post to tweak captions, likes and comments
- Live mobile-style preview as you edit
- Everything saves to your browser's local storage

## Stack

- Next.js 16 + React 18
- TypeScript
- Tailwind CSS
- @dnd-kit for sorting
- Lucide icons

## Run it locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build for production

```bash
npm run build
npm start
```

I usually run the production build through PM2 using the included `ecosystem.config.js`.

## Disclaimer

ViewGram is not affiliated with Instagram and can't post or manage your account. It's purely a visual planner.

## License

Do whatever you want with it. Built by [Yivani](https://yivani.dev).
