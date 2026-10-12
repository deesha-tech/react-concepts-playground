// The key lines shown under the demo. Lines starting with "!" are highlighted.
export const INDEX_CODE = `
{products.map((product, index) => (
!  <ProductRow key={index} product={product} />
))}
// Remove the first product: every row's key shifts by one.
// React keeps instance #1 (and its note, checkbox and qty) at position 0
// and just rewrites its text to the next product.
`;

export const ID_CODE = `
{products.map((product) => (
!  <ProductRow key={product.id} product={product} />
))}
// The key names the product, not the position.
// Remove, add, sort, shuffle: each instance follows its product,
// and React moves DOM nodes instead of rewriting them.
`;

export const RANDOM_CODE = `
{products.map((product) => (
!  <ProductRow key={Math.random()} product={product} />
))}
// A new key on every render = a "different" row every time.
// React unmounts all rows and mounts new ones: state lost, DOM rebuilt,
// even when nothing changed. Never generate keys during render.
`;

export const RESET_CODE = `
// The same rule, used on purpose: a new key = a fresh component.
// Switching products resets the form, with no effect and no manual reset.
!<ProductForm key={product.id} product={product} />

// No id in the data? Create one when the item is CREATED, not when it renders.
function addItem(text: string) {
!  setItems((items) => [...items, { id: crypto.randomUUID(), text }]);
}
`;
