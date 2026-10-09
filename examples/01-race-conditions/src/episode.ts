import type { Episode } from './shell/types';

export const EPISODE: Episode = {
  n: 1,
  slug: '01-race-conditions',
  title: 'Race Conditions',
  type: 'React Interview',
  summary: 'You typed "phone", but the screen shows results for "ph". Responses can come back out of order, and an old one overwrites the new one. Cancel stale requests with AbortController, and debounce the input.',
  concepts: ['Race condition', 'useEffect cleanup', 'AbortController', 'AbortError', 'Debounce'],
  steps: [
    'Keep "Buggy" selected and press "Type “phone” fast". The screen ends up showing results for "ph".',
    'Look at the timeline: the slow "ph" response arrives last and overwrites the newer results.',
    'Switch to "Fixed" and type again. Old requests are cancelled the moment you type the next letter.',
    'Turn on "Debounce 400 ms" and type again: five keystrokes, one request.',
  ],
  challenge: 'Move the AbortController and debounce logic into a reusable custom hook, useSearch(query), that returns { results, resultsFor, loading, error }. Both behaviours should stay the same.',
  interview: {
    question: 'A user types "phone" in a search box, but the screen shows results for "ph". Why does that happen, and how would you fix it?',
    answer: [
      "That's a race condition. Every keystroke starts a new request, and the network doesn't promise that responses come back in the order they were sent. So if the request for \"ph\" happens to be slower than the one for \"phone\", it arrives last and simply overwrites the correct results. React isn't doing anything wrong here. The problem is the network.",
      "The fix is to make sure only the latest request is allowed to update the state. In the effect that runs the search, I create an AbortController, pass its signal to the fetch call, and call abort in the cleanup function. When the query changes, React runs the previous effect's cleanup before running the effect again, so the old request gets cancelled. The cancelled fetch rejects with an AbortError, and I ignore that one, because cancelling is expected, not a real error.",
      "Then I'd add a small debounce, around 300 to 400 milliseconds, so the search only runs once the user pauses typing. That sends far fewer requests, which is better for the server and for the user's data plan.",
      "In a bigger app I'd usually let a library like TanStack Query handle this, because it stores every result under its own query key, so an old response can't overwrite the current one. But it's important to understand what's happening underneath.",
    ],
    short: "It's a race condition: responses can arrive out of order, so an old response overwrites the new one. I cancel the previous request with an AbortController in the useEffect cleanup and ignore the AbortError. Then I debounce the input by 300 to 400 milliseconds to send fewer requests.",
    followUps: [
      {
        q: 'Could you use an "ignore" flag in the cleanup instead of AbortController?',
        a: "Yes, a boolean flag set in the cleanup stops the stale response from updating state, and it works with any promise. But the old request still runs to completion. AbortController actually stops the network request, so I prefer it whenever the API supports a signal, and fetch and axios both do.",
      },
      {
        q: 'Does debouncing alone fix the race condition?',
        a: "No. Debouncing reduces how many requests you send, but if two requests are still in flight, say the user paused, typed again and paused, they can still come back out of order. Debounce is an optimisation. Cancelling the old request is the actual fix.",
      },
    ],
  },
  videoUrl: '',
};
