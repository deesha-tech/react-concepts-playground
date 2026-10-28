// Real requests to DummyJSON (https://dummyjson.com). Each one shows up as a bar in the request timeline.
import { trackedFetch } from './shell/timeline';

export interface Product { id: number; title: string; brand: string; price: number; rating: number; description: string; thumbnail: string }

/** The products in the picker. 9999 doesn't exist, so it shows how each version handles an error. */
export const PICKS = [
  { id: 123, label: 'iPhone 13 Pro' },
  { id: 78, label: 'MacBook Pro 14"' },
  { id: 100, label: 'Apple AirPods Max' },
  { id: 9999, label: 'A broken link' },
] as const;

const url = (id: number, delay: number) =>
  `https://dummyjson.com/products/${id}?select=title,brand,price,rating,description,thumbnail&delay=${delay}`;

/** One request for one product. DummyJSON's `delay` makes the server take about a second and a half, like a slow one, so the loading states are easy to see. */
export function getProduct(id: number): Promise<Product> {
  return trackedFetch<Product>(`GET /products/${id}`, url(id, 1400));
}

// ── The double trap ──────────────────────────────────────────────────────────────────────────────
// A component that calls getProduct() while rendering gets a NEW promise on every render. use() suspends on it,
// React renders again when it resolves, that render makes another new promise… forever. The playground stops the
// loop after a few requests so it doesn't hammer the server; in a real app nothing stops it.
export const LOOP_LIMIT = 8;
let loopRequests = 0;
export class LoopStopped extends Error {
  constructor(public count: number) { super(`Stopped after ${count} requests. A new promise on every render fetches forever.`); }
}
export function resetLoop() { loopRequests = 0; }
export function getProductEveryRender(id: number): Promise<Product> {
  loopRequests += 1;
  if (loopRequests > LOOP_LIMIT) return Promise.reject(new LoopStopped(LOOP_LIMIT));
  // Still a brand-new promise every render; the request itself starts just after render, so the timeline can draw it.
  return Promise.resolve().then(() => trackedFetch<Product>(`GET /products/${id}`, url(id, 350)));
}
