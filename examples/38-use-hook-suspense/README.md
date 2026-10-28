# Ep 38 · Goodbye useEffect Fetching

**Fetch a product in `useEffect` and the page renders empty before the request even starts.** This example compares that with React 19's `use()` API and `<Suspense>`, then shows the one mistake that makes `use()` fetch forever.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/deesha-tech/react-concepts-playground/tree/main/examples/38-use-hook-suspense?file=src/UseProduct.tsx)

## What you'll see

The **Trap** fetches in `useEffect`: three `useState`s (data, loading, error), a cleanup flag, and early returns. The component renders first, empty, and the request starts after that render.

The **Pattern** creates the promise when you pick a product, outside render, and the component reads it with `use(promise)`. `<Suspense>` shows the fallback while it's pending and an error boundary catches the broken link. No `useState`, no `useEffect`, no loading flag.

The **Double trap** creates the promise inside the component: `use(getProduct(id))`. Every render makes a new promise, `use()` suspends, React tries again, and every try fires another request. The playground stops it after 8; a real app wouldn't.

The **Network and render timeline** shows every request. Data comes from [DummyJSON](https://dummyjson.com) with a short delay, like a real server.

## use() or useEffect?

`use()` takes over **reading data**. `useEffect` keeps **synchronizing with things outside React**: it isn't going anywhere.

| | `use()` | `useEffect()` |
|---|---|---|
| Purpose | Read a promise (or a context) | Sync a component with an external system |
| When it runs | During render | After the render is committed, usually after paint |
| Conditional calls | Allowed, inside `if` and loops | Not allowed (Rules of Hooks) |
| Loading and errors | Handled by `<Suspense>` and an error boundary you add once | Written by hand: loading, error, cleanup |
| The promise | Must be stable: create it in an event, a loader or a cache | Not applicable |

Keep `useEffect` for:

- **Subscriptions:** a WebSocket, a real-time database listener, `window.addEventListener('scroll', …)`.
- **Browser APIs:** managing focus, measuring or resizing an element, controlling a video or audio player.
- **Third-party widgets:** maps, charts (D3, Chart.js), animation timelines that live outside React's state.

## How to play

1. Keep **Trap** selected and pick a product: the page renders empty first, then the request starts. Try **A broken link**.
2. Switch to **Pattern** and pick again: the request starts at the click, Suspense shows the fallback, the broken link lands in an error boundary.
3. Switch to **Double trap**: watch the requests pile up for the same product.

## Your challenges

This example comes with three challenges (warm-up, core and stretch). Take them in the [learning portal](https://www.deeshatechacademy.com/learn?next=/learn/playground/react/38-use-hook-suspense&utm_source=github&utm_medium=challenges&utm_campaign=react-series&utm_content=38-use-hook-suspense): commit your solution to your own repository, get it reviewed, and climb the leaderboard.

## Where to look

| File | What's in it |
|---|---|
| [`src/TrapProduct.tsx`](src/TrapProduct.tsx) | Fetching in useEffect, with data, loading and error state |
| [`src/UseProduct.tsx`](src/UseProduct.tsx) | `use(promise)`, the Suspense boundary and the error boundary |
| [`src/LoopProduct.tsx`](src/LoopProduct.tsx) | The double trap: a new promise on every render |
| [`src/api.ts`](src/api.ts) | The real requests, tracked in the timeline, and the loop's safety stop |

## The interview answer

"use() reads a promise during render: pending means the component suspends and Suspense shows the fallback, rejected means the error boundary catches it. You write no loading or error state and no effect, and the request starts before the render instead of after it. The promise must be stable: create it in an event, a loader or a cache, never inside the component, or every render makes a new one and it fetches forever."

---

📺 Watch the episode on our YouTube and Instagram · 🚀 Build a full production-ready React app, live: [React Application Development](https://www.deeshatechacademy.com/academy/courses/react-application-development?utm_source=github&utm_medium=readme&utm_campaign=react-series&utm_content=38-use-hook-suspense)
