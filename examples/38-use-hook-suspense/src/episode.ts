import type { Episode } from './shell/types';

export const EPISODE: Episode = {
  n: 38,
  slug: '38-use-hook-suspense',
  title: 'Goodbye useEffect Fetching',
  layout: 'drawer',
  pattern: 'Read promises with use()',
  type: 'React Concept',
  summary: 'Load a product the classic way: useEffect plus useState for the data, the loading flag and the error, and the page renders empty before the request even starts. Then read it with React 19 use() and Suspense: no loading or error state, and the request starts at the click. Finally, the one mistake that makes use() fetch forever.',
  concepts: ['use()', 'Suspense', 'Error boundaries', 'Promise caching', 'Fetch-on-render'],
  steps: [
    'Keep "Trap" selected and pick a product. The timeline shows the page rendering empty first, and only then the request. Try the broken link: the error is state you wrote yourself.',
    'Switch to "Pattern" and pick again. The request starts at the click, Suspense shows the fallback, and the broken link lands in an error boundary.',
    'Switch to "Double trap". The promise is created inside the component, so every render fetches again. Watch the requests pile up until the playground stops it.',
  ],
  challenges: [
    { level: 'Warm-up', text: 'In the Trap version, remove the ignore flag and switch products quickly. What can go wrong, and why does use() not need that flag?' },
    { level: 'Core', text: 'Fix the Double trap without moving the call out of the component: cache one promise per product id in a Map, so every render of the same id gets the same promise.' },
    { level: 'Stretch', text: 'Wrap the product switch in startTransition so the old product stays on screen while the new one loads, instead of falling back to the skeleton.' },
  ],
  tour: [
    { target: '.picker', title: 'Open a product', text: 'This is the classic way: the component fetches its own data in useEffect. Pick another product.', action: 'click', after: 1400 },
    { target: "section[aria-label='Network and render timeline']", title: 'Render first, fetch later', text: 'The page rendered empty, then the effect started the request. Until it returns you see a spinner from your own loading state.' },
    { target: '.demo-card[data-code]', title: 'All of this is yours', text: 'Three useStates, an effect, a cleanup flag, and two early returns, just to read one product.' },
    { target: '.seg button:nth-of-type(2)', title: 'Now with use()', text: 'React 19: create the promise when the user clicks, and read it with use().', action: 'click', after: 1400 },
    { target: '.slot', title: 'Suspense does the waiting', text: 'The skeleton is the Suspense fallback. Try the broken link: the error lands in an error boundary, not in state.' },
    { target: '.demo-card[data-code]', title: 'One line reads the data', text: 'use(promise) suspends until the promise settles. No useState, no useEffect, no loading flag.' },
    { target: '.seg button:nth-of-type(3)', title: 'The double trap', text: 'Now the promise is created inside the component.', action: 'click', after: 2400 },
    { target: "section[aria-label='Network and render timeline']", title: 'It never stops', text: 'Every render makes a new promise, so use() suspends and React tries again, and every try fires another request. The playground stops it after 8; a real app wouldn\'t.' },
    { target: '.pg-drawer-pill', title: 'Your turn', text: 'Three challenges wait behind this button: your own repository, a trainer review, points and a leaderboard.' },
    { target: '.pg-iv-teaser', title: 'Ready for the interview', text: 'Read how to explain use(), Suspense and the promise-in-render bug in an interview.' },
  ],
  challenge: 'Fix the Double trap without moving the call out of the component: cache one promise per product id in a Map.',
  interview: {
    question: 'What does the use() hook do in React 19, and why can\'t you create the promise inside the component that reads it?',
    answer: [
      "use() reads the value of a promise (or a context) during render. If the promise is still pending, the component suspends and the nearest <Suspense> shows its fallback; when it resolves, React renders again and use() returns the value. If it rejects, the error is thrown to the nearest error boundary. So the component has no useState for data, loading or error, and no useEffect.",
      "Compared with fetching in useEffect, it changes when the request starts. With useEffect the component renders first, empty, and the request starts after that render, which is why nested components fetch one after another. With use(), the promise is created before or outside the render, usually in an event handler, a router loader or a cache, so the request starts at the click.",
      "The catch is that use() needs a stable promise. If you write use(fetchProduct(id)) inside the component, every render creates a new promise. The component suspends, React tries the render again, and every try creates yet another promise and another request, so it fetches forever. React even warns about 'an uncached promise'.",
      "The fix is to create the promise outside render: in the event that changes the id, in a loader, or in a cache keyed by id, so every render of the same id gets the same promise. In real apps a data library or the framework does that caching for you.",
    ],
    short: "use() reads a promise during render: pending means the component suspends and Suspense shows the fallback, rejected means the error boundary catches it. You write no loading or error state and no effect, and the request starts before the render instead of after it. The promise must be stable: create it in an event, a loader or a cache, never inside the component, or every render makes a new one and it fetches forever.",
    followUps: [
      {
        q: 'So is useEffect dead?',
        a: "No. use() replaces useEffect for reading data, not for everything. useEffect is still the tool for synchronizing with things outside React: subscriptions like a WebSocket, a real-time database or a window scroll listener; browser APIs like focus, measuring an element or a video player; and third-party widgets like maps, D3 or Chart.js. The rule I use: use() for data, useEffect for syncing.",
      },
      {
        q: 'Can you call use() conditionally?',
        a: "Yes. Unlike other hooks, use() can be called inside if statements and loops, because React tracks it by the promise or context you pass, not by call order. It still has to be called during render, not in an event handler or an effect.",
      },
      {
        q: 'Does use() replace React Query or SWR?',
        a: "Not by itself. use() only reads a promise; it doesn't cache, dedupe, refetch or invalidate. Libraries and frameworks build those on top of it, which is exactly the caching the double trap is missing.",
      },
      {
        q: 'How do you keep the old content on screen while the next item loads?',
        a: "Start the update in a transition: startTransition(() => setPromise(getProduct(id))). React keeps showing the current content instead of the Suspense fallback until the new data is ready, and isPending tells you it's working.",
      },
    ],
  },
  videoUrl: '',
};
