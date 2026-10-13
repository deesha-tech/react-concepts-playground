import type { Episode } from './shell/types';

export const EPISODE: Episode = {
  n: 8,
  slug: '08-keys-in-lists',
  title: 'Index as Key Bug',
  layout: 'drawer',
  pattern: 'Stable identity keys',
  type: 'React Interview',
  summary: 'You typed a note on one product, deleted the row above it, and the note jumped to a different product. React matched the rows by position, because the key was the index. Watch what React does to the DOM with key={index}, key={product.id} and key={Math.random()}.',
  concepts: ['Keys', 'Reconciliation', 'State and position', 'Stable ids', 'Reset with key'],
  steps: [
    'Keep "Trap" selected. Type a note on the first product, tick Gift and bump its quantity. Then click "Remove first".',
    'The note, the tick and the quantity now sit on a different product. The log shows which instance was created for which product.',
    'Switch to "Pattern" and do the same. Everything stays with its product, and the log shows one row unmounted instead of every row rewritten.',
    'Switch to "Double trap" and click "Re-render only": nothing changed, yet every row unmounts and mounts again.',
  ],
  challenges: [
    { level: 'Warm-up', text: 'With key={index}, add a product at the END of the list (not on top) and type notes. Why does the bug not appear? When is an index key actually fine?' },
    { level: 'Core', text: 'The products lose their ids: map them to { title, price } only. Build a key without an id that still survives sorting and deleting, then explain why Math.random() and index both fail that test.' },
    { level: 'Stretch', text: 'Add a <ProductForm key={selected.id}> editor under the list that resets when you pick another product, without any useEffect. Then remove the key and watch the form go stale.' },
  ],
  tour: [
    { target: '.row:first-child .row-note', title: 'Give the first row some state', text: 'Type a note on the first product, tick “Gift” and press “+” once. React does not know about the note or the tick: the DOM owns them. The quantity is React state.' },
    { target: '.btn-remove', title: 'Now remove the first product', text: 'Delete the product you just annotated.', action: 'click', after: 500 },
    { target: '.rows', title: 'Wrong product!', text: 'Your note, tick and quantity are still in row 1, but row 1 is now a different product. The deleted product took nothing with it.' },
    { target: "section[aria-label='Reconciliation log']", title: 'Here is why', text: 'The key was the index. After the delete, index 0 still exists, so React kept instance #1 at position 0 and only rewrote its text. State belongs to the instance, and the instance stayed with the position.' },
    { target: '.demo-card[data-code]', title: 'The line that causes it', text: 'key={index}. The key is the position in the array, so after a delete every row gets the key of the row above it, and React keeps the old instances where they were.' },
    { target: '.seg button:nth-of-type(2)', title: 'Switch to the pattern', text: 'Use the product id as the key.', action: 'click', after: 400 },
    { target: '.row:first-child .row-note', title: 'Annotate the first row again', text: 'Type a note, tick “Gift”, bump the quantity. Then remove the first product with the button above.' },
    { target: '.btn-remove', title: 'Remove it', text: 'Delete the first product again.', action: 'click', after: 500 },
    { target: "section[aria-label='Reconciliation log']", title: 'Matched by product', text: 'Now the key names the product, so React unmounted exactly that one row and left the others alone: no text rewrites, no state in the wrong place. Try “Shuffle”: rows move, nothing is rebuilt.' },
    { target: '.demo-card[data-code]', title: 'The one-word fix', text: 'key={product.id}. The key names the product, not the position, so each instance follows its product through deletes, sorts and shuffles.' },
    { target: '.seg button:nth-of-type(3)', title: 'The double trap', text: 'A new key on every render. Click it, then press “Re-render only”.', action: 'click', after: 400 },
    { target: '.btn-rerender', title: 'Nothing changed… or did it?', text: 'Same six products, same order.', action: 'click', after: 500 },
    { target: "section[aria-label='Reconciliation log']", title: 'Everything was rebuilt', text: 'Six rows unmounted, six mounted, six new instances, all state gone, for a render where nothing changed. Keys generated during render are never stable.' },
    { target: '.demo-card[data-code]', title: 'The one line that matters', text: 'A key tells React which item an element IS, so it can keep, move or remove the right instance. Use the id from your data. If there is none, create an id when the item is created, never while rendering.' },
    { target: '.pg-drawer-pill', title: 'Your turn', text: 'Three challenges on this pattern wait behind this button: your own repository, a trainer review, points and a leaderboard.' },
    { target: '.pg-iv-teaser', title: 'Ready for the interview', text: 'Read how to explain keys and reconciliation in an interview, with the follow-up questions interviewers like to ask.' },
    { target: '[data-stage="try"]', title: 'Over to you 🎮', text: 'Sort, shuffle, add on top, re-render, in every key mode. Watch the log every time: it shows exactly what React did to the DOM.' },
  ],
  challenge: 'Add a <ProductForm key={selected.id}> editor under the list that resets when you pick another product, without any useEffect. Then remove the key and watch the form go stale.',
  interview: {
    question: 'A list of products has an input in every row. The user types in the first row and deletes that product, but the text stays in the first row, now under a different product. Why, and how would you fix it?',
    answer: [
      "The list is using the array index as the key. React matches the children of a list between renders by key, and that key is what decides whether an element is the same component instance as last time. With index keys, position 0 exists before and after the delete, so React keeps the component instance that was at position 0 and simply updates its props to the next product. The instance's state stays: its useState values, and also DOM state React doesn't track at all, like an uncontrolled input's text, a checkbox, focus or scroll position. So the text didn't move to the wrong product. The product moved out from under the text.",
      "The fix is a key that identifies the item, not the position: usually the id from the data, key={product.id}. Now when the first product is removed, React sees that its key is gone, unmounts exactly that instance, and leaves the others untouched. For a sort or a shuffle it moves the existing DOM nodes instead of rewriting every row, which is also the cheaper path: with index keys, inserting one item at the top means React rewrites the text of every row below it.",
      "Two related mistakes come up a lot. Generating a key during render, like key={Math.random()} or a fresh uuid in the map, is worse than the index: every render produces new keys, so React unmounts and remounts every row even when nothing changed, and all state is lost. And when the data genuinely has no id, I create one when the item is created, for example crypto.randomUUID() in the add handler, and store it with the item. Keys only need to be unique among siblings, not globally.",
      "An index key is acceptable only when the list is static: never reordered, filtered or inserted into, and the rows hold no state. The same mechanism is also useful on purpose. Passing key={product.id} to a form component resets it whenever a different product is selected, because a new key means a new instance, with no effect and no manual reset code.",
    ],
    short: "React matches list children by key. With key={index}, position 0 survives the delete, so React keeps that component instance and just updates its props, and its state, including the uncontrolled input's text, stays behind. Use a stable id from the data as the key so each instance follows its item. Never generate keys during render, and if the data has no id, create one when the item is created.",
    followUps: [
      {
        q: 'When is it fine to use the index as the key?',
        a: "When the list is static: it never gets reordered, filtered or inserted into anywhere except the end, and the rows hold no state of their own. Then position and identity are the same thing. The moment the list can shift, or rows have inputs, animations or local state, I want a real id.",
      },
      {
        q: 'Is key={Math.random()} or a uuid in the map a valid way to guarantee uniqueness?',
        a: "It guarantees uniqueness but destroys stability, which is the other half of what a key is for. Every render makes new keys, so React treats every row as new: unmount everything, mount everything, lose all state, even on a render where nothing changed. If I need an id, I create it once when the item is created and store it on the item.",
      },
      {
        q: 'What does React actually do with the key when it diffs the list?',
        a: "For each child of a parent, React looks for an element with the same key and the same type in the previous render. A match means the same instance: keep it, update its props, move its DOM node if the order changed. No match means a new instance: mount it. A previous key that no longer appears means unmount. That's why a stable key turns a reorder into a few DOM moves, while an index key turns it into a rewrite of every row.",
      },
      {
        q: 'Can a key be useful outside of lists?',
        a: "Yes. Because a changed key means a new instance, key={selected.id} on a form or editor resets it whenever the selection changes, without an effect that copies props into state. It's the pattern the React docs call resetting state with a key.",
      },
    ],
  },
  videoUrl: '',
};
