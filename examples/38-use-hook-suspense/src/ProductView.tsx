import type { Product } from './api';

/** The product page itself: the same in every version, so only the data loading differs. */
export function ProductView({ product }: { product: Product }) {
  return (
    <article className="pv">
      <img src={product.thumbnail} alt="" width={120} height={120} />
      <div>
        <p className="pv-brand">{product.brand}</p>
        <h3>{product.title}</h3>
        <p className="pv-desc">{product.description}</p>
        <p className="pv-meta"><b>${product.price}</b> · ★ {product.rating}</p>
      </div>
    </article>
  );
}

export function ProductSkeleton({ label = 'Loading…' }: { label?: string }) {
  return (
    <article className="pv pv-skeleton" aria-busy="true">
      <span className="pv-img" />
      <div><span className="pv-line w40" /><span className="pv-line w70" /><span className="pv-line w90" /><span className="pv-line w60" /><p className="pv-wait">{label}</p></div>
    </article>
  );
}

export function ProductError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="pv-error" role="alert">
      <b>Couldn't load this product.</b>
      <span>{message}</span>
      {onRetry && <button className="btn" onClick={onRetry}>Try again</button>}
    </div>
  );
}
