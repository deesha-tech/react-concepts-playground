// The live helpdesk, plus two layers on top of it (demo only):
//  - "Show components": a dashed box and a name tag on every component, so you can count them.
//  - The replay: after each update, amber boxes light up in the order React called the components (render),
//    then teal boxes flash where React actually changed the DOM (commit). Red dashed ghosts mark removed elements.
import { useState, type CSSProperties, type ReactNode } from 'react';
import { replay, useLog, type AppSnapshot, type Box } from './instrument';

export function Stage({ children }: { children: ReactNode }) {
  const [boxes, setBoxes] = useState(false);
  const [showState, setShowState] = useState(false);
  return (
    <div className="stage-wrap">
      <div className="stage-bar">
        <label className="boxes-toggle">
          <input type="checkbox" checked={boxes} onChange={(e) => setBoxes(e.target.checked)} />
          Show components
        </label>
        <label className="boxes-toggle">
          <input type="checkbox" checked={showState} onChange={(e) => setShowState(e.target.checked)} />
          Show state
        </label>
        <button className="btn btn-replay" onClick={replay}>↻ Replay the last update</button>
      </div>
      {showState && <StatePanel />}
      <div className={`stage ${boxes ? 'show-boxes' : ''}`}>
        {children}
        <Replay />
      </div>
    </div>
  );
}

const at = (b: Box, delay: number): CSSProperties => ({ left: b.x, top: b.y, width: b.w, height: b.h, animationDelay: `${delay}s` });

function Replay() {
  const { entries, slow, replays } = useLog();
  const e = entries[0];
  if (!e || e.trigger.kind === 'first') return null;
  const unit = slow ? 0.32 : 0.08;
  const commitAt = e.renders.length * unit + (slow ? 0.5 : 0.15);
  return (
    <div className="replay" key={`${e.id}-${replays}`} aria-hidden="true">
      {e.renderBoxes.map((b, i) => (
        <div key={`r${b.id}`} className={`rp-render ${b.name === 'App' ? 'rp-root' : ''}`} style={at(b, i * unit)}><span>{i + 1} · {b.name}</span></div>
      ))}
      {e.changedBoxes.map((b) => <div key={`c${b.id}`} className="rp-commit" style={at(b, commitAt)} />)}
      {e.removedBoxes.filter((b) => b.name === 'TicketCard').map((b) => <div key={`x${b.id}`} className="rp-removed" style={at(b, commitAt)} />)}
    </div>
  );
}

// "Show state": the useState values that App holds, live. The one the last trigger changed lights up with its setter.
// Drawn outside the helpdesk on purpose, so it never counts as a DOM change of the app.
const FIELDS: { key: keyof AppSnapshot; setter: string; show: (s: AppSnapshot) => string }[] = [
  { key: 'filter', setter: 'setFilter', show: (s) => `'${s.filter}'` },
  { key: 'query', setter: 'setQuery', show: (s) => `'${s.query}'` },
  { key: 'tickets', setter: 'setTickets', show: (s) => `[${s.tickets.length} tickets]` },
  { key: 'syncedAgo', setter: 'setSyncedAgo', show: (s) => String(s.syncedAgo) },
  { key: 'version', setter: 'setVersion', show: (s) => String(s.version ?? 0) },
];

function StatePanel() {
  const { entries, replays } = useLog();
  const e = entries[0];
  if (!e) return null;
  // A first render (or a reload) creates the state fresh: nothing "changed".
  const changed = (k: keyof AppSnapshot) => e.trigger.kind !== 'first' && Boolean(e.before) && JSON.stringify(e.before![k]) !== JSON.stringify(e.after[k]);
  // The exact call the trigger made, e.g. setQuery('p'), taken from the trigger's code
  const call = (setter: string) => e.trigger.code.split('\n').find((l) => l.trimStart().startsWith(setter))?.trim().replace(/\s*\/\/.*$/, '') ?? `${setter}()`;
  return (
    <div className="state-panel" key={`${e.id}-${replays}`} aria-label="App state">
      <span className="sp-title">App · useState</span>
      {FIELDS.map((f) => (
        <span key={f.key} className={`sp-field ${changed(f.key) ? 'sp-changed' : ''}`}>
          <b>{f.key}</b> <code>{f.show(e.after)}</code>
          {changed(f.key) && <small>{call(f.setter)}</small>}
        </span>
      ))}
    </div>
  );
}
