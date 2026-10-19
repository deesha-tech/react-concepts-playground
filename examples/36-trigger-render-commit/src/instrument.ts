// Demo instrumentation: records each update as Trigger → Render → Commit so the "Watch it" card can show it.
// Not part of the concept being taught. It only powers the lanes, the flashes and the spot-the-difference panel.
//
//  - Trigger: the handlers call recordTrigger() right before they call a state setter.
//  - Render:  every helpdesk component calls trackRender() while React calls it.
//  - Commit:  a MutationObserver watches the helpdesk's real DOM; App flushes the batch in useLayoutEffect,
//             which runs right after React has applied its changes to the DOM.
import { useSyncExternalStore } from 'react';
import type { Filter, Ticket } from './data';

export type TriggerKind = 'first' | 'click' | 'keystroke' | 'server' | 'timer' | 'same';

export interface Trigger {
  kind: TriggerKind;
  /** e.g. "Click · Open" */
  label: string;
  /** the setter call(s) the trigger ended in */
  code: string;
}

/** Everything the helpdesk shows, so the spot-the-difference panel can draw "before" and "after". */
export interface AppSnapshot {
  filter: Filter;
  query: string;
  tickets: Ticket[];
  syncedAgo: number;
  /** the bonus button's state: nothing on screen uses it */
  version?: number;
}

export interface Box { id: string; name: string; x: number; y: number; w: number; h: number }

export interface Place {
  id: string;
  name: string;
  ops: number;
  detail: string;
}

export interface Entry {
  id: number;
  trigger: Trigger;
  /** components React called, in the order it called them */
  renders: { id: string; name: string }[];
  /** components whose real DOM changed in the commit */
  places: Place[];
  /** components React called whose DOM did not change at all */
  unchanged: { id: string; name: string }[];
  /** total DOM operations (nodes added or removed, text and attribute writes) */
  ops: number;
  /** ids of component elements removed from the page */
  removedIds: string[];
  renderBoxes: Box[];
  changedBoxes: Box[];
  removedBoxes: Box[];
  before: AppSnapshot | null;
  after: AppSnapshot;
}

interface Pending {
  trigger: Trigger;
  renders: { id: string; name: string }[];
  rectsBefore: Map<string, Box>;
  before: AppSnapshot | null;
}

interface State { entries: Entry[]; slow: boolean; replays: number }

let state: State = { entries: [], slow: true, replays: 0 };
let pending: Pending | null = { trigger: { kind: 'first', label: 'First render', code: 'createRoot(el).render(<App />)' }, renders: [], rectsBefore: new Map(), before: null };
let nextId = 1;
let root: HTMLElement | null = null;
let observer: MutationObserver | null = null;
let readState: (() => AppSnapshot) | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function stageOf(el: HTMLElement): HTMLElement { return (el.closest('.stage') as HTMLElement | null) ?? el; }

function measure(): Map<string, Box> {
  const out = new Map<string, Box>();
  if (!root) return out;
  const stage = stageOf(root);
  const s = stage.getBoundingClientRect();
  // The page may be zoomed or scaled (e.g. when it's recorded for video): convert screen pixels back to the
  // stage's own CSS pixels, which is what the absolutely positioned replay boxes use.
  const k = stage.offsetWidth ? s.width / stage.offsetWidth : 1;
  [root, ...root.querySelectorAll<HTMLElement>('[data-comp-id]')].forEach((el) => {
    const r = el.getBoundingClientRect();
    out.set(el.dataset.compId!, { id: el.dataset.compId!, name: el.dataset.comp ?? '', x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k });
  });
  return out;
}

/** Call in an event handler, right before the state setter. */
export function recordTrigger(trigger: Trigger) {
  pending = { trigger, renders: [], rectsBefore: measure(), before: readState ? readState() : null };
}

/** Called by every helpdesk component while React renders it. */
export function trackRender(name: string, id: string) {
  if (!pending) pending = { trigger: { kind: 'same', label: 'Re-render', code: '' }, renders: [], rectsBefore: measure(), before: readState ? readState() : null };
  if (!pending.renders.some((r) => r.id === id)) pending.renders.push({ id, name });
}

/** App calls this once, when it mounts. */
export function registerRoot(el: HTMLElement, getState: () => AppSnapshot): () => void {
  root = el;
  readState = getState;
  observer = new MutationObserver(() => {}); // records are read synchronously in flushCommit()
  observer.observe(el, { childList: true, subtree: true, characterData: true, attributes: true });
  return () => { observer?.disconnect(); observer = null; root = null; };
}

/**
 * Attribute writes worth counting. Skipped: data-* (this demo's own markers) and the `name`/`type` attributes of
 * inputs, which ReactDOM rewrites on every render of an input as a form-quirk workaround. Neither is a real change.
 */
function isRealUpdate(r: MutationRecord): boolean {
  const name = r.attributeName ?? '';
  if (name.startsWith('data-')) return false;
  if (r.target instanceof HTMLInputElement && (name === 'name' || name === 'type')) return false;
  return true;
}

/** App calls this in useLayoutEffect after every commit: the DOM is updated, the browser hasn't painted yet. */
export function flushCommit() {
  if (!pending || !root || !readState) return;
  const p = pending;
  pending = null;
  const records = observer?.takeRecords() ?? [];
  const after = readState();
  const now = measure();
  const first = p.trigger.kind === 'first';

  const tally = new Map<string, { name: string; added: number; removed: number; text: number; attrs: number }>();
  const removedIds: string[] = [];
  const bump = (el: Element | null, key: 'added' | 'removed' | 'text' | 'attrs') => {
    const place = el?.closest<HTMLElement>('[data-comp-id]');
    if (!place || !root?.contains(place)) return;
    const id = place.dataset.compId!;
    const t = tally.get(id) ?? { name: place.dataset.comp ?? '', added: 0, removed: 0, text: 0, attrs: 0 };
    t[key]++;
    tally.set(id, t);
  };
  for (const r of records) {
    if (r.type === 'characterData') bump(r.target.parentElement, 'text');
    else if (r.type === 'attributes') { if (isRealUpdate(r)) bump(r.target as Element, 'attrs'); }
    else {
      r.addedNodes.forEach(() => bump(r.target as Element, 'added'));
      r.removedNodes.forEach((n) => {
        bump(r.target as Element, 'removed');
        if (n instanceof HTMLElement) {
          if (n.dataset.compId) removedIds.push(n.dataset.compId);
          n.querySelectorAll<HTMLElement>('[data-comp-id]').forEach((c) => removedIds.push(c.dataset.compId!));
        }
      });
    }
  }

  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
  let places: Place[] = [...tally].map(([id, t]) => ({
    id, name: t.name, ops: t.added + t.removed + t.text + t.attrs,
    detail: [t.removed && `${plural(t.removed, 'element')} removed`, t.added && `${plural(t.added, 'element')} added`, t.text && 'text changed', t.attrs && plural(t.attrs, 'attribute') + ' changed'].filter(Boolean).join(' · '),
  }));
  if (first) places = [{ id: 'app', name: 'App', ops: root.querySelectorAll('*').length, detail: 'every element created for the first time' }];
  const changed = new Set(places.map((pl) => pl.id));
  const unchanged = first ? [] : p.renders.filter((r) => !changed.has(r.id));

  const entry: Entry = {
    id: nextId++, trigger: p.trigger, renders: p.renders, places, unchanged,
    ops: places.reduce((a, pl) => a + pl.ops, 0), removedIds,
    renderBoxes: p.renders.map((r) => now.get(r.id)).filter((b): b is Box => Boolean(b)),
    changedBoxes: places.map((pl) => now.get(pl.id)).filter((b): b is Box => Boolean(b)),
    removedBoxes: removedIds.map((id) => p.rectsBefore.get(id)).filter((b): b is Box => Boolean(b)),
    before: p.before, after,
  };
  state = { ...state, entries: [entry, ...state.entries].slice(0, 6) };
  emit();
  window.dispatchEvent(new Event('pg-update-recorded'));
}

export const setSlow = (slow: boolean) => { state = { ...state, slow }; emit(); };
/** Plays the latest update's animation again (the lanes and the boxes over the app). */
export const replay = () => { state = { ...state, replays: state.replays + 1 }; emit(); };

export function useLog(): State {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state);
}

/** The helpdesk registers its triggers here so the trigger panel can fire them from outside. */
export const controls: Partial<Record<'click' | 'keystroke' | 'server' | 'timer' | 'same' | 'reload', () => void>> = {};
