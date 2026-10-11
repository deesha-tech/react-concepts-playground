// Real search requests to DummyJSON (https://dummyjson.com). Each call shows up as a bar in the request timeline.
import { trackedFetch } from './shell/timeline';

export interface SearchResult { query: string; items: string[] }

// DummyJSON's `delay` makes the server deliberately uneven, like a real server under load:
// the "la" search is the slow one, so it lands last, even when you type at a normal speed.
const DELAY_BY_LENGTH: Record<number, number> = { 1: 450, 2: 2600, 3: 650, 4: 550, 5: 500 };

export async function searchProducts(query: string, signal?: AbortSignal): Promise<SearchResult> {
  const ms = DELAY_BY_LENGTH[query.length] ?? 450;
  const data = await trackedFetch<{ products: { title: string }[] }>(
    `GET /products/search?q=${query}`,
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=10&select=title&delay=${ms}`,
    { signal, group: 'search' },
  );
  return { query, items: data.products.map((p) => p.title) };
}
