// SENIOR VERSION: fetch-then-render with React Router loaders.
// The router calls every matching loader as soon as the user clicks, in parallel,
// and renders the components only when the data is ready.
import { data, isRouteErrorResponse, Outlet, useLoaderData, useRouteError, type LoaderFunctionArgs } from 'react-router';
import { getProduct, getReviews, NotFoundError } from '../api';
import { useRenderMark } from '../useRenderMark';
import { Problem, ProductView, ReviewList } from '../ui';

/** Runs BEFORE the page renders. request.signal cancels the call if the user navigates away. */
export async function productLoader({ params, request }: LoaderFunctionArgs) {
  try {
    return await getProduct(params.productId ?? '', request.signal);
  } catch (error) {
    if (error instanceof NotFoundError) throw data({ message: error.message }, { status: 404 });
    throw error;
  }
}

/** A nested route's loader: it runs at the same time as productLoader, not after it. */
export async function reviewsLoader({ params, request }: LoaderFunctionArgs) {
  return getReviews(params.productId ?? '', request.signal);
}

/** No useState, no useEffect, no loading flag: the data is already here on the first render. */
export function SeniorProductPage() {
  const product = useLoaderData<typeof productLoader>();
  useRenderMark('Product page renders: product, with data');
  return (
    <ProductView product={product}>
      <Outlet />
    </ProductView>
  );
}

export function SeniorReviews() {
  const reviews = useLoaderData<typeof reviewsLoader>();
  useRenderMark('Reviews render: list, with data');
  return <ReviewList reviews={reviews} />;
}

/** A failed loader lands here instead of in a hand-written error state. */
export function SeniorProductError() {
  const error = useRouteError();
  useRenderMark('Error boundary renders');
  if (isRouteErrorResponse(error)) {
    return <Problem title={`${error.status} · Not found`} message={(error.data as { message?: string })?.message ?? 'Not found'} />;
  }
  return <Problem title="Something went wrong" message={error instanceof Error ? error.message : 'Unknown error'} />;
}
