# Ep 29 · React 19 Actions

**Double click "Post review" and your review posts twice. Post one that's too short, fix it, and the old error is still there.** This example shows the React 18 way to submit a form, then lets React 19 run the submit as an Action.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/deesha-tech/react-concepts-playground/tree/main/examples/29-react19-actions?file=src/ActionForm.tsx)

## What you'll see

The **Trap** is the classic `onSubmit` handler: four `useState`s (comment, rating, loading, error), `preventDefault` and a `try/catch/finally`. The button is never disabled, so a quick double click sends two requests, and the error is never cleared after a successful retry.

The **Pattern** passes an async function to `<form action>` through `useActionState`. React keeps the form pending while it runs, `useFormStatus` lets the submit button disable itself without props, the error is simply what the action returns, and the form resets after a success.

The **Bonus** adds `useOptimistic`: the review appears instantly as "sending…", and React drops it by itself if the server rejects it.

The **Network and render timeline** shows every POST request, so a double submit is two bars and a correct one is one. Requests go to [DummyJSON](https://dummyjson.com) with a short delay, like a real server.

## How to play

1. Keep **Trap** selected. Write a review and click **Post review** twice, quickly: two requests, and the review appears twice.
2. Post a review shorter than 10 characters, then a proper one: it saves, but the old error stays.
3. Switch to **Pattern** and repeat: one request, the error clears, the form resets.
4. Switch to **Bonus** and post a short review: it appears instantly, then disappears when the server says no.

## Your challenges

This example comes with three challenges (warm-up, core and stretch). Take them in the [learning portal](https://www.deeshatechacademy.com/learn?next=/learn/playground/react/29-react19-actions&utm_source=github&utm_medium=challenges&utm_campaign=react-series&utm_content=29-react19-actions): commit your solution to your own repository, get it reviewed, and climb the leaderboard.

## Where to look

| File | What's in it |
|---|---|
| [`src/TrapForm.tsx`](src/TrapForm.tsx) | The React 18 form: onSubmit, useState for loading and error, try/catch/finally |
| [`src/ActionForm.tsx`](src/ActionForm.tsx) | The React 19 form: useActionState, `<form action>`, and a SubmitButton with useFormStatus |
| [`src/OptimisticForm.tsx`](src/OptimisticForm.tsx) | The same action with useOptimistic |
| [`src/api.ts`](src/api.ts) | The real requests to DummyJSON, tracked in the timeline |

## The interview answer

"An Action is an async function React runs in a transition, like `<form action={fn}>`. useActionState gives you its result and a pending flag, so errors are just return values and you write no loading or error state. useFormStatus lets the submit button read the form's pending state, which stops double submits. The form resets after a success, and useOptimistic can show the result before the server answers."

---

📺 Watch the episode on our YouTube and Instagram · 🚀 Build a full production-ready React app, live: [React Application Development](https://www.deeshatechacademy.com/academy/courses/react-application-development?utm_source=github&utm_medium=readme&utm_campaign=react-series&utm_content=29-react19-actions)
