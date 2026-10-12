// Watches what React actually does to the DOM after each action, so the demo can show it.
// Not part of the concept being taught: it only powers the "Reconciliation log" panel.
import { useSyncExternalStore } from 'react';

export interface RowSnapshot {
  /** The product currently rendered in this <li> */
  item: string;
  /** The component instance number (React state) and the product it was first created for */
  instance: number;
  bornFor: string;
  /** DOM-owned state: the uncontrolled note and checkbox */
  note: string;
  gift: boolean;
  /** React-owned state: the quantity stepper */
  qty: number;
}

export interface LogEntry {
  id: number;
  action: string;
  /** <li> elements inserted / removed / moved (same node removed and re-inserted) */
  mounted: number;
  unmounted: number;
  moved: number;
  /** text and attribute updates inside rows that stayed */
  updated: number;
  /** new component instances React created (remounts show up here) */
  instances: number;
  rows: RowSnapshot[];
}

interface State { entries: LogEntry[]; rows: RowSnapshot[] }

let state: State = { entries: [], rows: [] };
let nextId = 1;
let pendingAction = 'Render';
let instancesBefore = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Call right before the state update that will change the list. */
export function recordAction(label: string, instancesNow: number) {
  pendingAction = label;
  instancesBefore = instancesNow;
}

export function resetLog() {
  state = { entries: [], rows: [] };
  emit();
}

function snapshot(list: HTMLElement): RowSnapshot[] {
  return [...list.querySelectorAll<HTMLLIElement>('li.row')].map((li) => ({
    item: li.dataset.item ?? '',
    instance: Number(li.dataset.instance),
    bornFor: li.dataset.born ?? '',
    note: li.querySelector<HTMLInputElement>('.row-note')?.value ?? '',
    gift: li.querySelector<HTMLInputElement>('.row-gift input')?.checked ?? false,
    qty: Number(li.querySelector('.row-qty output')?.textContent ?? 1),
  }));
}

/**
 * Attribute writes worth counting. Skipped: data-* (the demo's own instrumentation) and the `name`/`type`
 * attributes of inputs, which ReactDOM rewrites on every render of an uncontrolled input as a form-quirk
 * workaround. Neither is reconciliation work.
 */
function isRealUpdate(r: MutationRecord): boolean {
  const name = r.attributeName ?? '';
  if (name.startsWith('data-')) return false;
  if (r.target instanceof HTMLInputElement && (name === 'name' || name === 'type')) return false;
  return true;
}

/** Observes the list and turns every batch of DOM mutations into one log entry. Returns a cleanup. */
export function attach(list: HTMLElement, instancesNow: () => number): () => void {
  const observer = new MutationObserver((records) => {
    const added = new Set<Node>(), removed = new Set<Node>();
    for (const r of records) {
      if (r.type !== 'childList') continue;
      r.addedNodes.forEach((n) => { if (n instanceof HTMLElement && n.matches('li.row')) added.add(n); });
      r.removedNodes.forEach((n) => { if (n instanceof HTMLElement && n.matches('li.row')) removed.add(n); });
    }
    // Updates inside a row that was just mounted are part of mounting it, not of updating a kept row.
    const inNewRow = (n: Node) => [...added].some((a) => a.contains(n));
    let updated = 0;
    for (const r of records) {
      if (inNewRow(r.target)) continue;
      if (r.type === 'characterData') updated++;
      else if (r.type === 'attributes' && isRealUpdate(r)) updated++;
    }
    const moved = [...added].filter((n) => removed.has(n)).length;
    const rows = snapshot(list);
    // Typing in an uncontrolled input makes ReactDOM touch attributes we ignore: nothing to report, unless
    // the visitor explicitly asked for a re-render, where "DOM untouched" is exactly the lesson.
    if (!added.size && !removed.size && !updated && pendingAction === 'Render') {
      state = { ...state, rows };
      emit();
      return;
    }
    const entry: LogEntry = {
      id: nextId++, action: pendingAction,
      mounted: added.size - moved, unmounted: removed.size - moved, moved, updated,
      instances: Math.max(0, instancesNow() - instancesBefore), rows,
    };
    pendingAction = 'Render';
    instancesBefore = instancesNow();
    state = { entries: [entry, ...state.entries].slice(0, 8), rows };
    emit();
    window.dispatchEvent(new Event('pg-keys-action'));
  });
  observer.observe(list, { childList: true, subtree: true, characterData: true, attributes: true });
  state = { ...state, rows: snapshot(list) };
  emit();
  return () => observer.disconnect();
}

/** Re-reads the rows without a DOM mutation (typing in an uncontrolled input changes no DOM attribute). */
export function refreshRows(list: HTMLElement) {
  state = { ...state, rows: snapshot(list) };
  emit();
}

export function useReconcileLog(): State {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => state,
  );
}
