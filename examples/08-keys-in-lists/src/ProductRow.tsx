// One row of the list. It deliberately holds three kinds of state that React does NOT get from props:
//   • the note and the "Gift" checkbox: uncontrolled, so the DOM owns their values
//   • the quantity: React state (useState)
//   • the instance number: React state created once, when this component instance mounts
// With key={index}, all three stay with the POSITION when the list changes. With key={product.id}, they
// stay with the PRODUCT. With key={Math.random()}, they are thrown away on every render.
import { useRef, useState } from 'react';
import { price, type Product } from './api';
import { recordAction } from './reconcile';

let instances = 0;
/** How many ProductRow instances React has created so far (remounts create new ones). */
export const instanceCount = () => instances;

export function ProductRow({ product }: { product: Product }) {
  const [instance] = useState(() => ++instances); // runs once per instance, never again on re-render
  const bornFor = useRef(product.title);          // the product this instance was created for
  const [qty, setQty] = useState(1);
  const changeQty = (by: number) => {
    recordAction(`Quantity ${by > 0 ? '+1' : '−1'} on “${product.title}”`, instances); // log label only
    setQty((q) => Math.max(1, q + by));
  };

  return (
    <li className="row" data-instance={instance} data-born={bornFor.current} data-item={product.title}>
      <img className="row-img" src={product.thumbnail} alt="" width="44" height="44" />
      <div className="row-main">
        <strong>{product.title}</strong>
        <span className="muted">{price(product)}</span>
      </div>
      <label className="row-gift"><input type="checkbox" /> Gift</label>
      <input className="row-note" placeholder="Note…" aria-label={`Note for ${product.title}`} />
      <span className="row-qty" aria-label="Quantity">
        <button type="button" onClick={() => changeQty(-1)} aria-label="Less">−</button>
        <output>{qty}</output>
        <button type="button" onClick={() => changeQty(+1)} aria-label="More">+</button>
      </span>
      <span className="row-badge" title={`Component instance #${instance}, created for ${bornFor.current}`}>#{instance}</span>
    </li>
  );
}
