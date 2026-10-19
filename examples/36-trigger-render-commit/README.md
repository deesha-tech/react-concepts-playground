# Ep 36 · Trigger → Render → Commit

**Everyone says "React re-renders"… but what actually happens between typing a letter and your screen updating?** This example lets you fire four everyday triggers and watch React handle each one in three steps.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/deesha-tech/react-concepts-playground/tree/main/examples/36-trigger-render-commit?file=src/Helpdesk.tsx)

## What you'll see

A keystroke, a click, a server reply and a timer all end the same way: some code calls a state setter. That is the **trigger**. React doesn't redraw anything yet; it schedules a render.

In the **render**, React calls your components, the one whose state changed and everything below it. Each returns a description of its part of the screen, and React compares it with the previous one (reconciliation). Type one letter, "p", and React calls seven components.

In the **commit**, React applies only the differences to the real DOM. Seven components rendered, but only one place on the page changed: the ticket list. The header and the sidebar rendered and weren't touched at all. A re-render is a function call, not a repaint.

## How to play

1. Tick **Show components**, count the boxes, and guess how many components typing **one letter** in the search box will run.
2. Type **p** in the search box (or press **Keystroke**). Amber boxes light up in the order React calls each component; teal flashes show what really changed in the DOM.
3. In **Watch it**, press **Play** in Spot the difference and try to beat React to the changes.
4. Try **Click** on a filter, **Server reply** (two setters, one render), **Timer**, **Reload** (the first render) and the bonus, **re-render with the same data**.

## Your challenges

This example comes with three challenges (warm-up, core and stretch). Take them in the [learning portal](https://www.deeshatechacademy.com/learn?next=/learn/playground/react/36-trigger-render-commit&utm_source=github&utm_medium=challenges&utm_campaign=react-series&utm_content=36-trigger-render-commit): commit your solution to your own repository, get it reviewed, and climb the leaderboard.

## Where to look

| File | What's in it |
|---|---|
| [`src/Helpdesk.tsx`](src/Helpdesk.tsx) | The helpdesk (App → Header, SideNav, MainPanel → TicketCard) and every trigger's setter |
| [`src/data.ts`](src/data.ts) | The tickets and the filtering, in plain TypeScript |
| [`src/instrument.ts`](src/instrument.ts) | Records each update as trigger → render → commit, with a MutationObserver on the real DOM (demo instrumentation only) |
| [`src/code.ts`](src/code.ts) | The three steps, in code |

## The interview answer

"A state update triggers a render. In the render phase React calls the component and everything below it, and each returns a description of its UI; React compares it with the previous one. In the commit phase it applies only the differences to the DOM, then the browser paints and effects run. Render must be pure, setters in one event are batched, and a re-render is a function call, not a repaint."

---

📺 Watch the episode on our YouTube and Instagram · 🚀 Build a full production-ready React app, live: [React Application Development](https://www.deeshatechacademy.com/academy/courses/react-application-development?utm_source=github&utm_medium=readme&utm_campaign=react-series&utm_content=36-trigger-render-commit)
