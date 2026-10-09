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
  videoUrl: '',
};
