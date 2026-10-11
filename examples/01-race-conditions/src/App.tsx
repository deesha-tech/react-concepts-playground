import { useEffect, useRef, useState } from 'react';
import { PlaygroundShell } from './shell/PlaygroundShell';
import { RequestTimeline } from './shell/RequestTimeline';
import { CodePeek } from './shell/CodePeek';
import { timeline, useTimeline } from './shell/timeline';
import { EPISODE } from './episode';
import { BuggySearch } from './BuggySearch';
import { FixedSearch } from './FixedSearch';
import { useDebouncedValue } from './useDebouncedValue';
import { BUGGY_CODE, FIXED_CODE, DEBOUNCE_CODE } from './code';
import './demo.css';

type Mode = 'buggy' | 'fixed';

/** The search the demo is built around: "la" (the slow, stale response) returns makeup, "laptop" returns laptops. */
const WORD = 'laptop';

export function App() {
  return (
    <PlaygroundShell episode={EPISODE}>
      <SearchDemo />
    </PlaygroundShell>
  );
}

function SearchDemo() {
  const [mode, setMode] = useState<Mode>('buggy');
  const [debounce, setDebounce] = useState(false);
  const [text, setText] = useState('');
  const [round, setRound] = useState(0); // remounts the search component for a clean start
  const typing = useRef<number[]>([]);

  const restart = (label: string) => {
    typing.current.forEach(clearTimeout);
    typing.current = [];
    setText('');
    setRound((r) => r + 1);
    timeline.reset(label);
  };
  const onType = (value: string) => {
    if (!text && value) timeline.reset('Started typing');
    setText(value);
  };
  const autoType = () => {
    restart('Typing "laptop", one letter every 80 ms');
    [...WORD].forEach((_, i) => {
      typing.current.push(window.setTimeout(() => setText(WORD.slice(0, i + 1)), 80 * (i + 1)));
    });
  };
  // Tell the guided tour when a burst of typing has fully settled (every request done or cancelled).
  const { requests } = useTimeline();
  const settled = requests.length > 0 && requests.every((r) => r.status !== 'pending');
  useEffect(() => {
    if (!settled || text.length < 3) return;
    const t = window.setTimeout(() => window.dispatchEvent(new Event('pg-search-settled')), 300);
    return () => clearTimeout(t);
  }, [settled, text, requests.length]);

  const switchMode = (next: Mode) => { setMode(next); restart(`Switched to ${next}`); };

  return (
    <div className="demo">
      <section className="demo-card" data-stage="try">
        <div className="demo-head">
          <span className="stage-tag">1 · Try it</span>
          <div className="seg" role="group" aria-label="Version">
            <button aria-pressed={mode === 'buggy'} onClick={() => switchMode('buggy')}>Buggy · no cleanup</button>
            <button className="seg-good" aria-pressed={mode === 'fixed'} onClick={() => switchMode('fixed')}>Fixed · AbortController</button>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={debounce} onChange={(e) => { setDebounce(e.target.checked); restart(e.target.checked ? 'Debounce on' : 'Debounce off'); }} />
            Debounce 400 ms
          </label>
        </div>
        <div className="demo-body">
          <div className="search-bar">
            <input
              type="search"
              value={text}
              onChange={(e) => onType(e.target.value)}
              placeholder="Type “laptop” quickly…"
              aria-label="Search products"
            />
            <button className="btn btn-primary" onClick={autoType} title="Types “laptop”, one letter every 80 ms">▶ Type it for me</button>
            <button className="btn" onClick={() => restart('Cleared')}>Clear</button>
          </div>
          {/* key: every restart remounts the search, so no state (or pending debounce) leaks into the next run */}
          <SearchRunner key={`${mode}-${round}`} mode={mode} debounce={debounce} text={text} />
        </div>
        <p className="demo-note">
          {mode === 'buggy'
            ? 'Every keystroke starts a request, and nothing cancels the old ones. Red bars in the timeline are stale responses that overwrote newer results.'
            : 'Each keystroke aborts the previous request in the effect cleanup, so a stale response can never reach the screen. Grey bars are the cancelled requests.'}
        </p>
      </section>

      <RequestTimeline minScaleMs={1800} />
      <CodePeek
        title={mode === 'buggy' ? 'Buggy: no cleanup' : 'Fixed: abort in the cleanup'}
        file={mode === 'buggy' ? 'src/BuggySearch.tsx' : 'src/FixedSearch.tsx'}
        code={mode === 'buggy' ? BUGGY_CODE : FIXED_CODE}
      />
      {debounce && <CodePeek title="Bonus: debounce the input" file="src/useDebouncedValue.ts" code={DEBOUNCE_CODE} />}
    </div>
  );
}

function SearchRunner({ mode, debounce, text }: { mode: Mode; debounce: boolean; text: string }) {
  const debounced = useDebouncedValue(text, 400);
  const query = debounce ? debounced : text;
  const Search = mode === 'buggy' ? BuggySearch : FixedSearch;
  return <Search query={query} typed={text} />;
}
