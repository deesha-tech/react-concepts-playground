import type { Episode } from './shell/types';

export const EPISODE: Episode = {
  n: 19,
  slug: '19-loaders-vs-useeffect',
  title: 'Loaders vs useEffect',
  type: 'React Concept',
  summary: 'Fetching in useEffect starts the request only after the first render, so nested components fetch one after another. A React Router loader fetches before render, in parallel.',
  concepts: ['useEffect fetching', 'Request waterfall', 'Loaders', 'useLoaderData', 'request.signal', 'useNavigation'],
  steps: [
    'Keep "Junior · useEffect" selected and open a product. Watch the timeline: two requests, one after the other.',
    'Switch to "Senior · loader" and open the same product. Both requests start at the click, side by side.',
    'Open a product and click "All products" before it loads. Only the senior version cancels the request.',
    'Open "A product that doesn\'t exist" in both modes to compare error handling.',
  ],
  challenge: 'Add a third request, "GET /products/:id/related", as another nested route with its own loader. Confirm in the timeline that the total time stays the same in senior mode, then try it in junior mode.',
  interview: {
    question: 'How do you load the data a page needs in React? Would you fetch it in useEffect?',
    answer: [
      "Fetching in useEffect works, but it comes with a cost. The effect only runs after the component's first render, so the page renders empty first and only then starts the request. If a child component also fetches in its own effect, it can't even start until the parent has its data. So the requests line up one after another, and that's what we call a request waterfall. On top of that, every component ends up hand-writing its own loading state, error state and cancellation.",
      "With a data router like React Router, I move that work into a loader on the route. The loader runs as soon as the navigation starts, before the component renders, and the loaders of nested routes run in parallel. The component simply reads the result with useLoaderData, so the data is already there on the very first render. No useState, no useEffect, no loading flag.",
      "I also get a few things out of the box. If a loader throws, for example a 404, the route's error boundary renders instead of a hand-written error state. And because the loader receives request.signal, I pass it to my fetch call, so the request is cancelled automatically if the user navigates away halfway through.",
      "While loaders are running, I show pending UI with useNavigation, usually a single progress bar at the top of the app. And I still use useEffect, just for what it's meant for: synchronising with something outside React, like a WebSocket, a timer or a browser API.",
    ],
    short: "Fetching in useEffect starts the request only after render, which causes waterfalls and a lot of manual loading and error handling. A loader fetches before render, runs nested loaders in parallel, sends errors to the route's error boundary, and cancels requests on navigation through request.signal. I keep useEffect for syncing with external systems.",
    followUps: [
      {
        q: "But doesn't the page now wait for the data before it shows anything?",
        a: "Yes, and that's deliberate: the user sees one complete page instead of a page full of spinners. useNavigation tells me a navigation is pending, so I show a global progress bar. If one API is really slow, I don't await it in the loader. I return the promise and stream that part in with Suspense and Await, so the rest of the page shows straight away.",
      },
      {
        q: 'So is fetching in useEffect always wrong?',
        a: "No. It's fine for small apps without a data router, or for data that isn't tied to a route. But for page data, the route is the better owner, and for server state across many components I'd reach for a library like TanStack Query.",
      },
    ],
  },
  videoUrl: '',
};
