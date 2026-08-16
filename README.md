# ViewGram

A dumb simple Instagram preview thing I made because I kept screwing up my grid.

Basically:
- Drag/drop images to build your feed
- Edit your profile (name, bio, link, stats) 
- Click any post to tweak caption/likes/comments
- See a live mobile preview as you go
- Everything stays in your browser - nothing leaves your machine

I use this before I actually post. Saves me from those "wait that doesn't look right" moments after hitting share.

## Stack
- Next.js 16 + React 18
- TypeScript (because I like not yelling at undefined)
- Tailwind CSS
- @dnd-kit for the drag/drop stuff
- Lucide icons (they're clean)

## Running it
```bash
npm install
npm run dev
```

Then open http://localhost:3000

## For the server
I run this on my Ubuntu box with PM2. There's an ecosystem.config.js in the root - just point nginx at port 3002 (or whatever you set) and you're good.

## One last thing
This is NOT affiliated with Instagram. Can't post, can't schedule, can't do anything but let you preview. It's a sandbox, not a manager.

If you find it useful, cool. If not, whatever. Made by Yivani (yivani.dev).