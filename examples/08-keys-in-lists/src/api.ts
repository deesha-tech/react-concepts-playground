// Real products from DummyJSON (https://dummyjson.com). The ids come from the data, which is the point:
// a key should identify the item, and the server already gave every product a stable id.
import { trackedFetch } from './shell/timeline';

export interface Product { id: number; title: string; price: number; thumbnail: string }

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const price = (p: Product) => usd.format(p.price);

/** Loads a pool of products: the first six go on screen, the rest are added by "Add on top". */
export async function loadProducts(count = 12): Promise<Product[]> {
  const data = await trackedFetch<{ products: Product[] }>(
    'GET /products',
    `https://dummyjson.com/products?limit=${count}&select=id,title,price,thumbnail`,
  );
  return data.products;
}
