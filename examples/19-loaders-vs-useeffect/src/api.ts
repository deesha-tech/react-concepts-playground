// A fake API with realistic delays. Each call shows up as a bar in the request timeline.
import { fakeFetch } from './shell/timeline';
import { PRODUCTS, REVIEWS, type Product, type Review } from './data';

export type { Product, Review };

export class NotFoundError extends Error {}

/** 1 = normal, 2 = slow network. Changed from the speed menu in the demo. */
export const network = { speed: 1 };

export function getProduct(id: string, signal?: AbortSignal): Promise<Product> {
  return fakeFetch(`GET /products/${id}`, 900 * network.speed, () => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) throw new NotFoundError(`No product with id ${id}.`);
    return product;
  }, { signal });
}

export function getReviews(id: string, signal?: AbortSignal): Promise<Review[]> {
  return fakeFetch(`GET /products/${id}/reviews`, 800 * network.speed, () => REVIEWS[id] ?? [], { signal });
}
