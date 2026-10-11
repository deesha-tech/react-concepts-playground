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
  challenges: [
    { level: 'Warm-up', text: 'Set Network to "Slow" and open the same product in both modes. Which one feels better to use, and why?' },
    { level: 'Core', text: 'Add a third request, "related products", as another nested route with its own loader. The total time should stay the same in senior mode. Then try it in junior mode.' },
    { level: 'Stretch', text: 'Make the reviews non-blocking: return their promise from the loader without awaiting it, and render it with <Suspense> and <Await>. The product should appear first.' },
  ],
  tour: [
    { target: '.seg', title: 'Two ways to load data', text: 'This switch flips between the useEffect version (junior) and the React Router loader version (senior).' },
    { target: 'a.shop-card', title: 'Open a product', text: 'Click this product. The data comes live from DummyJSON.', action: 'click', after: 2200 },
    { target: "section[aria-label='Network and render timeline']", title: 'See the waterfall', text: 'Every request is a bar. The reviews only start after the product arrives: one after another. That staircase is a request waterfall.' },
    { target: '.seg button:nth-of-type(2)', title: 'Now the loader version', text: 'Switch to the senior version. It reopens the same product.', action: 'click', after: 1600 },
    { target: "section[aria-label='Network and render timeline']", title: 'Parallel, from the click', text: 'Both requests now start the moment you click, side by side. Same data, roughly half the wait.' },
    { target: '.demo-card[data-code]', title: 'The code that makes the difference', text: 'The highlighted lines are the pattern: a loader on the route, and useLoaderData in the component. No useState, no useEffect.' },
    { target: '.pg-challenge', title: 'Your turn', text: 'Pick a challenge and edit the code in StackBlitz. The app reloads as you type.' },
    { target: '.pg-iv-teaser', title: 'Ready for the interview', text: 'Finally, read how to explain this in an interview: a model answer, a 30-second version and follow-ups.' },
    { target: '[data-stage="try"]', title: 'Over to you 🎮', text: 'Now play with it yourself: flip the toggle, try different products or searches, change things and break them. Watch the timeline every time.' },
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
