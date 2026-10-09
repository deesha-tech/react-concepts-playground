# Ep 01 · Race Conditions

**You typed "phone", but the screen shows results for "ph". Why?** This example lets you trigger the bug, see it on a timeline, and fix it.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/deesha-tech/react-concepts-playground/tree/main/examples/01-race-conditions?file=src/FixedSearch.tsx)

## What you'll see

Every keystroke starts a new request, and responses don't always come back in order. In the buggy version, a slow, old response arrives last and overwrites the correct results. That's a race condition.

The fix cancels the previous request in the useEffect cleanup with an `AbortController`, so only the latest request can update the screen. A 400 ms debounce then cuts five requests down to one.

## How to play

1. Keep **Buggy** selected and press **Type "phone" fast**. The screen ends on results for "ph".
2. Look at the timeline: the red bars are stale responses that overwrote newer results.
3. Switch to **Fixed** and type again. Old requests turn grey: cancelled.
4. Turn on **Debounce 400 ms** and type again: one request.

## Your challenge

Move the AbortController and debounce logic into a reusable custom hook, `useSearch(query)`, that returns `{ results, resultsFor, loading, error }`. Both behaviours should stay the same.

## Where to look

| File | What's in it |
|---|---|
| [`src/BuggySearch.tsx`](src/BuggySearch.tsx) | One request per keystroke, no cleanup |
| [`src/FixedSearch.tsx`](src/FixedSearch.tsx) | AbortController in the effect cleanup, AbortError ignored |
| [`src/useDebouncedValue.ts`](src/useDebouncedValue.ts) | The debounce hook |
| [`src/api.ts`](src/api.ts) | The fake search API, with a deliberately slow "ph" search |

## The interview answer

"It's a race condition: responses can arrive out of order. I cancel the previous request with an AbortController in the useEffect cleanup, ignore the AbortError, and debounce the input to send fewer requests."

---

📺 Watch the episode on our YouTube and Instagram · 🚀 Build a full production-ready React app, live: [React Application Development](https://www.deeshatechacademy.com/academy/courses/react-application-development?utm_source=github&utm_medium=readme&utm_campaign=react-series&utm_content=01-race-conditions)
