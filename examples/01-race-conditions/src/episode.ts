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
  videoUrl: '',
};
