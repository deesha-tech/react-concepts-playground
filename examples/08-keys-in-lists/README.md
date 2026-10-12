# Ep 08 · Index as Key Bug

**You typed a note on one product, deleted the row above it, and the note jumped to a different product. Why?** This example lets you trigger the bug, watch what React does to the DOM, and fix it.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/deesha-tech/react-concepts-playground/tree/main/examples/08-keys-in-lists?file=src/KeyedList.tsx)

## What you'll see

React matches the rows of a list between renders by their `key`. With `key={index}`, position 0 exists before and after a delete, so React keeps the component instance that was there and only rewrites its text. Its state stays: the `useState` quantity, and the DOM state React never sees, like an uncontrolled input's text or a checkbox.

With `key={product.id}` each instance follows its product: a delete unmounts exactly one row, a shuffle moves DOM nodes instead of rewriting them. With `key={Math.random()}` every render rebuilds every row and throws all state away.

The **Reconciliation log** under the list counts what React really did to the DOM after every action (rows mounted, unmounted, moved, text updates, new component instances) and flags rows whose state was created for a different product.

## How to play

1. Keep **Buggy** selected. Type a note on the first product, tick **Gift**, bump the quantity, then click **Remove first**.
2. The note, tick and quantity now belong to a different product. The log shows why.
3. Switch to **Fixed** and repeat. Everything stays with its product; the log shows one row unmounted.
4. Switch to **Worse** and click **Re-render only**: nothing changed, yet every row is rebuilt.

## Your challenges

- **Warm-up:** with `key={index}`, add a product at the *end* of the list and type notes. Why does the bug not appear? When is an index key actually fine?
- **Core:** strip the ids from the products. Build a key without an id that still survives sorting and deleting, then explain why `Math.random()` and the index both fail that test.
- **Stretch:** add a `<ProductForm key={selected.id}>` editor that resets when you pick another product, without any `useEffect`. Then remove the key and watch the form go stale.

## Where to look

| File | What's in it |
|---|---|
| [`src/KeyedList.tsx`](src/KeyedList.tsx) | The list, the actions, and the one line that picks the key |
| [`src/ProductRow.tsx`](src/ProductRow.tsx) | A row with DOM state (note, checkbox), React state (quantity) and an instance number |
| [`src/reconcile.ts`](src/reconcile.ts) | A MutationObserver that counts what React did to the real DOM (demo instrumentation only) |
| [`src/code.ts`](src/code.ts) | The three keys side by side, plus "reset a form with a key" |

## The interview answer

"React matches list children by key. With `key={index}`, position 0 survives the delete, so React keeps that instance and just updates its props; its state, including the input's text, stays behind. Use a stable id from the data as the key. Never generate keys during render, and if the data has no id, create one when the item is created."

---

📺 Watch the episode on our YouTube and Instagram · 🚀 Build a full production-ready React app, live: [React Application Development](https://www.deeshatechacademy.com/academy/courses/react-application-development?utm_source=github&utm_medium=readme&utm_campaign=react-series&utm_content=08-keys-in-lists)
