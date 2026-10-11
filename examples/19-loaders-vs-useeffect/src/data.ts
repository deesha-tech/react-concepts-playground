// Real products from DummyJSON (https://dummyjson.com), the same API the course app uses.
export interface ProductSummary { id: string; name: string; image: string }
export interface Product extends ProductSummary { price: number; brand?: string; description: string }
export interface Review { id: string; author: string; rating: number; text: string }

/** The three products on the list page. Their details and reviews are fetched live. */
export const PRODUCTS: ProductSummary[] = [
  { id: '123', name: 'iPhone 13 Pro', image: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp' },
  { id: '78', name: 'MacBook Pro 14"', image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp' },
  { id: '105', name: 'MagSafe Battery Pack', image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp' },
];
