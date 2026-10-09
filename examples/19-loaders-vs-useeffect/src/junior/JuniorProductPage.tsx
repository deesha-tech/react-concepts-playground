// JUNIOR VERSION: fetch-on-render.
// Each component renders first, then starts its own request in useEffect.
// The child can't start until the parent has its data, so the requests form a waterfall.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProduct, getReviews, type Product, type Review } from '../api';
import { useRenderMark } from '../useRenderMark';
import { Loading, Problem, ProductView, ReviewList } from '../ui';

export function JuniorProductPage() {
  const { productId = '' } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProduct(productId) // starts only AFTER the first render
      .then(setProduct)
      .catch(setError)
      .finally(() => setLoading(false));
    // No cancellation: if the user leaves, this request keeps running.
  }, [productId]);

  useRenderMark(loading ? 'Product page renders: empty, with a spinner' : error ? 'Product page renders: error' : 'Product page renders: product');

  if (loading) return <Loading label="Loading product…" />;
  if (error) return <Problem title="Something went wrong" message={error.message} />;
  if (!product) return null;

  return (
    <ProductView product={product}>
      {/* Mounts only now, so its request starts only now */}
      <JuniorReviews productId={productId} />
    </ProductView>
  );
}

function JuniorReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    getReviews(productId).then(setReviews);
  }, [productId]);

  useRenderMark(reviews ? 'Reviews render: list' : 'Reviews render: spinner');

  if (!reviews) return <Loading label="Loading reviews…" />;
  return <ReviewList reviews={reviews} />;
}
