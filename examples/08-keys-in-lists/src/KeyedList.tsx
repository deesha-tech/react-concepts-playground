import { useEffect, useRef, useState } from 'react';
import { loadProducts, type Product } from './api';
import { ProductRow, instanceCount } from './ProductRow';
import { attach, recordAction, refreshRows, resetLog } from './reconcile';

export type KeyMode = 'index' | 'id' | 'random';

export const KEY_LABEL: Record<KeyMode, string> = { index: 'key={index}', id: 'key={product.id}', random: 'key={Math.random()}' };

/** The three ways people write the key. Only one of them identifies the product. */
function keyFor(mode: KeyMode, product: Product, index: number): React.Key {
  if (mode === 'index') return index;           // the position: changes whenever the list shifts
  if (mode === 'random') return Math.random();  // a new key every render: React remounts every row
  return product.id;                            // the product: stable, from the data
}

const shuffle = <T,>(arr: T[]) => arr.map((x) => [Math.random(), x] as const).sort((a, b) => a[0] - b[0]).map(([, x]) => x);

export function KeyedList({ mode }: { mode: KeyMode }) {
  const [pool, setPool] = useState<Product[]>([]);   // products not yet on screen, for "Add on top"
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, rerender] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    loadProducts().then((all) => {
      if (controller.signal.aborted) return;
      recordAction('Loaded products', instanceCount());
      setProducts(all.slice(0, 6));
      setPool(all.slice(6));
    }).catch((e: Error) => { if (e.name !== 'AbortError') setError(e.message); });
    return () => controller.abort();
  }, []);

  // The log watches the real DOM of this list (see reconcile.ts).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    return attach(list, instanceCount);
  }, []);

  const act = (label: string, next: (ps: Product[]) => Product[]) => {
    recordAction(label, instanceCount());
    setProducts(next);
  };
  const addOnTop = () => {
    const [p, ...rest] = pool;
    if (!p) return;
    setPool(rest);
    act(`Add “${p.title}” on top`, (ps) => [p, ...ps]);
  };

  return (
    <>
      <div className="actions" role="group" aria-label="Change the list">
        <button className="btn btn-primary btn-remove" onClick={() => act('Remove the first product', (ps) => ps.slice(1))} disabled={!products.length}>Remove first</button>
        <button className="btn btn-add" onClick={addOnTop} disabled={!pool.length}>Add on top</button>
        <button className="btn btn-sort" onClick={() => act('Sort by price', (ps) => [...ps].sort((a, b) => a.price - b.price))}>Sort by price</button>
        <button className="btn btn-shuffle" onClick={() => act('Shuffle', shuffle)}>Shuffle</button>
        <button className="btn btn-rerender" onClick={() => { recordAction('Re-render only (same data)', instanceCount()); rerender((n) => n + 1); }} title="Re-renders the list with the same products">Re-render only</button>
      </div>
      {error && <p className="tag-bad">Could not load products: {error}</p>}
      {/* The whole lesson is this one line: which key you pick decides what React thinks "the same row" is. */}
      <ul className="rows" ref={listRef} onInput={() => listRef.current && refreshRows(listRef.current)} onChange={() => listRef.current && refreshRows(listRef.current)}>
        {products.map((product, index) => (
          <ProductRow key={keyFor(mode, product, index)} product={product} />
        ))}
      </ul>
      {!products.length && !error && <p className="muted">Loading products…</p>}
    </>
  );
}

/** Clears the log when the key mode changes, so each mode starts from a clean slate. */
export function useFreshLog(mode: KeyMode) {
  useEffect(() => { resetLog(); }, [mode]);
}
