import { Suspense, useState } from 'react';
import { PlaygroundShell } from './shell/PlaygroundShell';
import { RequestTimeline } from './shell/RequestTimeline';
import { CodePeek } from './shell/CodePeek';
import { timeline } from './shell/timeline';
import { EPISODE } from './episode';
import { PICKS, getProduct, resetLoop, type Product } from './api';
import { TrapProduct } from './TrapProduct';
import { ErrorBoundary, ProductSlot } from './UseProduct';
import { LoopProduct } from './LoopProduct';
import { ProductSkeleton } from './ProductView';
import { LOOP_CODE, TRAP_CODE, USE_CODE } from './code';
import './demo.css';

type Mode = 'trap' | 'pattern' | 'loop';

const NOTE: Record<Mode, string> = {
  trap: 'The component renders first, empty. Only then does the effect start the request, so every product shows a spinner from state you manage yourself: data, loading, error, plus a cleanup flag so a slow answer doesn\'t overwrite a newer one.',
  pattern: 'The promise is created when you click, outside render. use() reads it: Suspense shows the fallback while it\'s pending, and an error boundary catches the broken link. No useState, no useEffect, no loading flag.',
  loop: 'The promise is created inside the component, so every render makes a new one. use() suspends, React tries the render again, and every try fires another request for the same product. Watch the timeline: the playground stops it after 8 requests, a real app wouldn\'t.',
};
const CODE: Record<Mode, { title: string; file: string; code: string }> = {
  trap: { title: 'Trap: fetching in useEffect', file: 'src/TrapProduct.tsx', code: TRAP_CODE },
  pattern: { title: 'Pattern: use() + Suspense', file: 'src/UseProduct.tsx', code: USE_CODE },
  loop: { title: 'Double trap: a new promise every render', file: 'src/LoopProduct.tsx', code: LOOP_CODE },
};

export function App() {
  return (
    <PlaygroundShell episode={EPISODE}>
      <FetchDemo />
    </PlaygroundShell>
  );
}

function FetchDemo() {
  const [mode, setMode] = useState<Mode>('trap');
  const [id, setId] = useState<number>(PICKS[0].id);
  const [round, setRound] = useState(0);                                   // remounts the slot for a clean start
  const [promise, setPromise] = useState<Promise<Product>>(() => getProduct(PICKS[0].id));

  const label = (pid: number) => PICKS.find((p) => p.id === pid)?.label ?? String(pid);
  const pick = (pid: number) => {
    timeline.reset(`Click: open ${label(pid)}`);
    setId(pid);
    if (mode === 'pattern') setPromise(getProduct(pid));                 // the request starts at the click
    if (mode === 'loop') { resetLoop(); setRound((r) => r + 1); }
  };
  const switchMode = (next: Mode) => {
    timeline.reset(`Switched to ${next === 'trap' ? 'Trap' : next === 'pattern' ? 'Pattern' : 'Double trap'}: open ${label(id)}`);
    setMode(next); setRound((r) => r + 1); resetLoop();
    if (next === 'pattern') setPromise(getProduct(id));
  };

  return (
    <div className="demo">
      <section className="demo-card" data-stage="try">
        <div className="demo-head">
          <span className="stage-tag">1 · Try it</span>
          <div className="seg" role="group" aria-label="Version">
            <button aria-pressed={mode === 'trap'} onClick={() => switchMode('trap')}>Trap<span className="seg-key"> · useEffect</span></button>
            <button className="seg-good" aria-pressed={mode === 'pattern'} onClick={() => switchMode('pattern')}>Pattern<span className="seg-key"> · use() + Suspense</span></button>
            <button aria-pressed={mode === 'loop'} onClick={() => switchMode('loop')}>Double trap<span className="seg-key"> · promise in render</span></button>
          </div>
        </div>
        <div className="demo-body">
          <div className="picker" role="group" aria-label="Product">
            {PICKS.map((p) => (
              <button key={p.id} className={`btn pick${p.id === 9999 ? ' pick-broken' : ''}`} aria-pressed={id === p.id} onClick={() => pick(p.id)}>{p.label}</button>
            ))}
          </div>
          <div className="slot">
            {mode === 'trap' && <TrapProduct key={round} id={id} />}
            {mode === 'pattern' && <ProductSlot key={`${round}-${id}`} promise={promise} />}
            {mode === 'loop' && (
              <ErrorBoundary key={round}>
                <Suspense fallback={<ProductSkeleton label="Suspense fallback… again…" />}>
                  <LoopProduct id={id} />
                </Suspense>
              </ErrorBoundary>
            )}
          </div>
        </div>
        <p className="demo-note">{NOTE[mode]}</p>
      </section>

      <RequestTimeline minScaleMs={2600} />
      <CodePeek title={CODE[mode].title} file={CODE[mode].file} code={CODE[mode].code} />
    </div>
  );
}
