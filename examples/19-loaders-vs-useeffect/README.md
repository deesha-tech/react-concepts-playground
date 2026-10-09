# Ep 19 · Loaders vs useEffect

**Fetching data in useEffect works. But senior developers increasingly reach for loaders.** This example shows why, side by side.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/deesha-tech/react-concepts-playground/tree/main/examples/19-loaders-vs-useeffect?file=src/senior/routes.tsx)

## What you'll see

| | Junior · useEffect | Senior · loader |
|---|---|---|
| When the request starts | After the first, empty render | The moment the user clicks |
| Nested data (product, then reviews) | One after another: a **waterfall** | In parallel |
| Loading and error states | Written by hand in every component | Router + `ErrorBoundary` |
| User leaves mid-load | Request keeps running | Cancelled through `request.signal` |
| Pending UI | Spinners inside the page | One progress bar from `useNavigation()` |

## How to play

1. Keep **Junior · useEffect** selected and open a product. The timeline shows two requests, one after the other.
2. Switch to **Senior · loader** and open the same product. Both requests start at the click.
3. Open a product and click **All products** before it loads. Only the senior version cancels.
4. Open **A product that doesn't exist** in both modes to compare error handling.

## Your challenge

Add a third request, `GET /products/:id/related`, as another nested route with its own loader. Confirm in the timeline that the total time stays the same in senior mode. Then add it to the junior version and watch the waterfall grow.

## Where to look

| File | What's in it |
|---|---|
| [`src/junior/JuniorProductPage.tsx`](src/junior/JuniorProductPage.tsx) | Fetch-on-render with useState and useEffect |
| [`src/senior/routes.tsx`](src/senior/routes.tsx) | The loaders, `useLoaderData` and the route error boundary |
| [`src/App.tsx`](src/App.tsx) | The router config, and `useNavigation()` for the progress bar |
| [`src/api.ts`](src/api.ts) | The fake API and its delays |

## When useEffect is still right

useEffect is for synchronising with things outside React: a WebSocket, a timer, a browser API. For the data a page needs, the route is the better place.

---

📺 Watch the episode on our YouTube and Instagram · 🚀 Build a full production-ready React app, live: [React Application Development](https://www.deeshatechacademy.com/academy/courses/react-application-development?utm_source=github&utm_medium=readme&utm_campaign=react-series&utm_content=19-loaders-vs-useeffect)
