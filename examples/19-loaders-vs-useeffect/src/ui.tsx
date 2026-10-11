// Plain presentational pieces shared by both versions, so the only difference is how data is loaded.
import type { ReactNode } from 'react';
import type { Product, Review } from './api';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function ProductView({ product, children }: { product: Product; children?: ReactNode }) {
  return (
    <article className="shop-product">
      <div className="shop-hero">
        <img className="shop-img" src={product.image} alt="" />
        <div>
          <h3>{product.name}</h3>
          <p className="muted">{product.description}</p>
          <p className="shop-price">{product.brand ? `${product.brand} · ` : ''}{usd.format(product.price)}</p>
        </div>
      </div>
      <h4>Reviews</h4>
      {children}
    </article>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return <p className="muted">No reviews yet.</p>;
  return (
    <ul className="shop-reviews">
      {reviews.map((r) => (
        <li key={r.id}><strong>{'★'.repeat(r.rating)}</strong> {r.text} <span className="muted">· {r.author}</span></li>
      ))}
    </ul>
  );
}

export function Loading({ label }: { label: string }) {
  return <p className="shop-loading"><span className="spinner" />{label}</p>;
}

export function Problem({ title, message }: { title: string; message: string }) {
  return (
    <div className="shop-problem" role="alert">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}
