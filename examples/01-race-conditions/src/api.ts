// A fake search API. Each call shows up as a bar in the request timeline.
import { fakeFetch } from './shell/timeline';

const CATALOGUE = [
  'Phone case', 'Phone stand', 'Phone charger', 'Photo frame', 'Photo printer', 'Phono preamp',
  'Pillow', 'Planner', 'Plant pot', 'Power bank', 'Printer paper', 'Pen set', 'Headphones', 'Smartphone gimbal',
];

export interface SearchResult { query: string; items: string[] }

// Deliberately uneven, like a real server under load: the "ph" search is the slow one.
const DELAY_BY_LENGTH: Record<number, number> = { 1: 450, 2: 1500, 3: 650, 4: 550 };

export function searchProducts(query: string, signal?: AbortSignal): Promise<SearchResult> {
  const ms = DELAY_BY_LENGTH[query.length] ?? 450;
  return fakeFetch(`GET /search?q=${query}`, ms, () => ({
    query,
    items: CATALOGUE.filter((name) => name.toLowerCase().includes(query.toLowerCase())),
  }), { signal, group: 'search' });
}
