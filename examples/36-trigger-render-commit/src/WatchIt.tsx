// "2 · Watch it": the latest update as three lanes (Trigger → Render → Commit), spot the difference, and a short history.
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useLog, type Entry } from './instrument';
import { HelpdeskPicture } from './Helpdesk';

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

/** "TicketCard, TicketCard, TicketCard" → "TicketCard ×3" */
function grouped(names: string[]): string[] {
  const out: { name: string; n: number }[] = [];
  for (const name of names) {
    const last = out[out.length - 1];
    if (last?.name === name) last.n++; else out.push({ name, n: 1 });
  }
  return out.map((g) => (g.n > 1 ? `${g.name} ×${g.n}` : g.name));
}

export function WatchIt() {
  const { entries, slow, replays } = useLog();
  const e = entries[0];
  return (
    <section className="demo-card" aria-label="Trigger, render, commit" data-stage="watch">
      <div className="demo-head"><span className="stage-tag">2 · Watch it</span><h2>Trigger → Render → Commit</h2><span className="tl-live"><i />live</span></div>
      <div className="demo-body">
        {!e ? <p className="tl-empty">Fire a trigger above and every step shows up here.</p> : (
          <>
            <Lanes e={e} unit={slow ? 0.32 : 0.08} key={`${e.id}-${replays}`} />
            <Spot e={e} key={`spot${e.id}`} />
            {entries.length > 1 && (
              <ol className="history" aria-label="Earlier updates">
                {entries.slice(1).map((h) => (
                  <li key={h.id}>
                    <span className="h-trig">{h.trigger.label}</span>
                    <span>{plural(h.renders.length, 'component')} rendered</span>
                    <span className={h.places.length ? 'h-changed' : 'h-none'}>{h.trigger.kind === 'first' ? 'everything created' : h.places.length ? `${plural(h.places.length, 'place')} changed` : 'nothing changed'}</span>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function Lanes({ e, unit }: { e: Entry; unit: number }) {
  const first = e.trigger.kind === 'first';
  const commitAt = e.renders.length * unit + (unit > 0.1 ? 0.5 : 0.15);
  const d = (s: number): CSSProperties => ({ animationDelay: `${s}s` });
  return (
    <div className="lanes">
      <div className="lane lane-trigger" style={d(0)}>
        <h3><span className="lane-n">1</span> Trigger</h3>
        <p className="lane-big">{e.trigger.label}</p>
        <pre className="lane-code">{e.trigger.code}</pre>
        <p className="lane-note">{first ? 'The app starts: React has to build everything once.' : 'A setter was called. React schedules a render. Nothing on screen has changed yet.'}</p>
      </div>

      <div className="lane lane-render" style={d(0.15)}>
        <h3><span className="lane-n">2</span> Render</h3>
        <p className="lane-big"><b className="lane-count">{e.renders.length}</b> {e.renders.length === 1 ? 'component' : 'components'} called</p>
        <ol className="chips">
          {e.renders.map((r, i) => <li key={r.id} style={d(i * unit)}>{r.name}{r.name === 'TicketCard' ? <small> #{r.id.slice(1)}</small> : null}</li>)}
        </ol>
        <p className="lane-note">React calls your component functions. Each returns a description of its part of the screen, then React compares it with the last one.</p>
      </div>

      <div className="lane lane-commit" style={d(commitAt)}>
        <h3><span className="lane-n">3</span> Commit</h3>
        {first ? (
          <p className="lane-big"><b className="lane-count">{e.ops}</b> elements created</p>
        ) : (
          <p className="lane-big"><b className="lane-count">{e.places.length}</b> {e.places.length === 1 ? 'place' : 'places'} changed in the DOM</p>
        )}
        {!first && (
          <ul className="changes">
            {e.places.map((p) => <li key={p.id} className="ch-yes"><b>{p.name}</b> {p.detail}</li>)}
            {e.unchanged.length > 0 && <li className="ch-no"><b>{grouped(e.unchanged.map((u) => u.name)).join(', ')}</b> rendered, but nothing changed</li>}
          </ul>
        )}
        <p className="lane-note">{first ? 'Everything is new, so everything is created.' : e.places.length === 0 ? 'Same description as before, so React touches nothing at all.' : 'Only the differences touch the real page. Then the browser paints, and effects run.'}</p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------------------------------------
// Spot the difference: the screen before and after, as React "sees" them. Circles appear after a 3-second countdown.

interface Ring { id: string; x: number; y: number; w: number; h: number; kind: 'diff' | 'same' }

function Spot({ e }: { e: Entry }) {
  const [phase, setPhase] = useState<'idle' | 3 | 2 | 1 | 'shown'>('idle');
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const [rings, setRings] = useState<{ before: Ring[]; after: Ring[] }>({ before: [], after: [] });

  useEffect(() => {
    if (typeof phase !== 'number') return;
    const t = setTimeout(() => setPhase(phase === 1 ? 'shown' : ((phase - 1) as 2 | 1)), 800);
    return () => clearTimeout(t);
  }, [phase]);

  useLayoutEffect(() => {
    if (phase !== 'shown') return;
    const measure = (host: HTMLDivElement | null, ids: string[], kind: Ring['kind']): Ring[] => {
      if (!host) return [];
      const h = host.getBoundingClientRect();
      const k = host.offsetWidth ? h.width / host.offsetWidth : 1;   // page zoom: back to the host's CSS pixels
      return ids.flatMap((id) => {
        const el = host.querySelector<HTMLElement>(`[data-comp-id="${id}"]`);
        if (!el) return [];
        const r = el.getBoundingClientRect();
        return [{ id, kind, x: (r.left - h.left) / k, y: (r.top - h.top) / k, w: r.width / k, h: r.height / k }];
      });
    };
    const changed = e.places.map((p) => p.id).filter((id) => id !== 'app');
    // Before: circle what disappeared, and changed places that didn't just lose children (those are already circled).
    const beforeIds = [...e.removedIds, ...changed.filter((id) => !(id === 'mainpanel' && e.removedIds.length))];
    const same = e.unchanged.map((u) => u.id).filter((id) => id === 'header' || id === 'sidenav' || id === 'mainpanel');
    setRings({
      before: measure(beforeRef.current, beforeIds, 'diff'),
      after: [...measure(afterRef.current, changed, 'diff'), ...measure(afterRef.current, same, 'same')],
    });
  }, [phase, e]);

  if (!e.before || e.trigger.kind === 'first') return null;
  const count = e.places.length + e.removedIds.length;
  return (
    <div className="spot">
      <div className="spot-head">
        <h3>Spot the difference</h3>
        {phase === 'idle' && <button className="btn btn-primary spot-play" onClick={() => setPhase(3)}>▶ Play · 3 seconds</button>}
        {typeof phase === 'number' && <span className="spot-count" key={phase}>{phase}</span>}
        {phase === 'shown' && <span className="spot-done">{count ? 'React found these.' : 'No differences: nothing to commit.'} That comparison is <b>reconciliation</b>.</span>}
      </div>
      <div className="spot-pics">
        {(['before', 'after'] as const).map((side) => (
          <figure key={side}>
            <figcaption>{side === 'before' ? 'Before' : 'After'}</figcaption>
            <div className="pic" ref={side === 'before' ? beforeRef : afterRef}>
              <div className="pic-scale"><HelpdeskPicture snap={side === 'before' ? e.before! : e.after} /></div>
              {phase === 'shown' && rings[side].map((r) => (
                <div key={`${r.kind}${r.id}`} className={`ring ring-${r.kind}`} style={{ left: r.x - 4, top: r.y - 4, width: r.w + 8, height: r.h + 8 }}>
                  {r.kind === 'same' && <span>same ✓</span>}
                </div>
              ))}
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
