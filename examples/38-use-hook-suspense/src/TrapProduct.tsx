// TRAP: fetching in useEffect. The component renders first (empty), the effect starts the request after that,
// and you write the loading state, the error state and the cleanup yourself.
import { useEffect, useState } from 'react';
import { getProduct, type Product } from './api';
import { ProductError, ProductSkeleton, ProductView } from './ProductView';
import { timeline } from './shell/timeline';

export function TrapProduct({ id }: { id: number }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;                       // don't set state if the user already picked another product
    timeline.mark('Rendered empty, now the effect starts the request');
    setLoading(true);
    setError(null);
    getProduct(id)
      .then((p) => { if (!ignore) setProduct(p); })
      .catch((e) => { if (!ignore) setError(e); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <ProductSkeleton label="Spinner from your own loading state…" />;
  if (error) return <ProductError message={error.message} />;
  if (!product) return null;
  return <ProductView product={product} />;
}
