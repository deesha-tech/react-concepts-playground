// DOUBLE TRAP: creating the promise INSIDE the component. Every render makes a new promise, so use() suspends again,
// React tries the render again, and every try fires another request. Forever.
import { use } from 'react';
import { getProductEveryRender } from './api';
import { ProductView } from './ProductView';

export function LoopProduct({ id }: { id: number }) {
  const product = use(getProductEveryRender(id));   // ✕ a new promise on every render
  return <ProductView product={product} />;
}
