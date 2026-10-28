// PATTERN: React 19 use(). The promise is created OUTSIDE render (when the user picks a product) and passed in.
// The component just reads it: <Suspense> shows the fallback while it's pending, an error boundary catches a failure.
import { Component, Suspense, use, type ReactNode } from 'react';
import type { Product } from './api';
import { ProductError, ProductSkeleton, ProductView } from './ProductView';

export function UseProduct({ promise }: { promise: Promise<Product> }) {
  const product = use(promise);            // suspends until the promise settles; no useState, no useEffect
  return <ProductView product={product} />;
}

/** How the page uses it: one Suspense for the waiting, one error boundary for the failure. */
export function ProductSlot({ promise }: { promise: Promise<Product> }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ProductSkeleton label="Suspense fallback…" />}>
        <UseProduct promise={promise} />
      </Suspense>
    </ErrorBoundary>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    return this.state.error ? <ProductError message={this.state.error.message} /> : this.props.children;
  }
}
