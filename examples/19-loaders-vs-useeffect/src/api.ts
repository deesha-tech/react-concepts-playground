// Real requests to DummyJSON. Each call shows up as a bar in the request timeline.
// DummyJSON's `delay` parameter adds a fixed server delay, so the timings are easy to see and repeat.
import { HttpError, trackedFetch } from './shell/timeline';
import type { Product, Review } from './data';

export type { Product, Review };

const API = 'https://dummyjson.com';

export class NotFoundError extends Error {}

/** 1 = normal, 2 = slow network. Changed from the speed menu in the demo. */
export const network = { speed: 1 };

interface DummyProduct { id: number; title: string; description: string; price: number; brand?: string; thumbnail: string }
interface DummyReviews { reviews: { rating: number; comment: string; reviewerName: string }[] }

export async function getProduct(id: string, signal?: AbortSignal): Promise<Product> {
  try {
    const p = await trackedFetch<DummyProduct>(`GET /products/${id}`,
      `${API}/products/${id}?select=title,description,price,brand,thumbnail&delay=${900 * network.speed}`, { signal });
    return { id: String(p.id), name: p.title, description: p.description, price: p.price, brand: p.brand, image: p.thumbnail };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) throw new NotFoundError(`No product with id ${id}.`);
    throw error;
  }
}

export async function getReviews(id: string, signal?: AbortSignal): Promise<Review[]> {
  try {
    const r = await trackedFetch<DummyReviews>(`GET /products/${id}/reviews`,
      `${API}/products/${id}?select=reviews&delay=${800 * network.speed}`, { signal });
    return r.reviews.map((x, i) => ({ id: `${id}-${i}`, author: x.reviewerName, rating: x.rating, text: x.comment }));
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return []; // the product's own loader reports the 404
    throw error;
  }
}
