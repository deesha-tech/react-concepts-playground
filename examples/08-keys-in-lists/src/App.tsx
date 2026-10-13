import { useState } from 'react';
import { PlaygroundShell } from './shell/PlaygroundShell';
import { CodePeek } from './shell/CodePeek';
import { EPISODE } from './episode';
import { KeyedList, KEY_LABEL, useFreshLog, type KeyMode } from './KeyedList';
import { ReconcileLog } from './ReconcileLog';
import { ID_CODE, INDEX_CODE, RANDOM_CODE, RESET_CODE } from './code';
import './demo.css';

export function App() {
  return (
    <PlaygroundShell episode={EPISODE}>
      <KeysDemo />
    </PlaygroundShell>
  );
}

const NOTE: Record<KeyMode, string> = {
  index: 'The key is the position. When the list shifts, React keeps each row instance where it is and rewrites its text, so the note, checkbox and quantity stay behind with the position.',
  id: 'The key is the product. Each row instance follows its product wherever it goes, and React moves or removes DOM nodes instead of rewriting every row.',
  random: 'The key changes on every render, so React sees six brand-new rows each time: it unmounts everything, mounts everything again, and all state is lost.',
};

function KeysDemo() {
  const [mode, setMode] = useState<KeyMode>('index');
  const [round, setRound] = useState(0); // remounts the list on a mode change, so each mode starts clean
  useFreshLog(mode);
  const switchMode = (next: KeyMode) => { setMode(next); setRound((r) => r + 1); };

  return (
    <div className="demo">
      <section className="demo-card" data-stage="try">
        <div className="demo-head">
          <span className="stage-tag">1 · Try it</span>
          <div className="seg" role="group" aria-label="Key">
            <button aria-pressed={mode === 'index'} onClick={() => switchMode('index')}>Trap<span className="seg-key"> · {KEY_LABEL.index}</span><span className="seg-key-short"> · index</span></button>
            <button className="seg-good" aria-pressed={mode === 'id'} onClick={() => switchMode('id')}>Pattern<span className="seg-key"> · {KEY_LABEL.id}</span><span className="seg-key-short"> · id</span></button>
            <button aria-pressed={mode === 'random'} onClick={() => switchMode('random')}>Double trap<span className="seg-key"> · {KEY_LABEL.random}</span><span className="seg-key-short"> · random</span></button>
          </div>
        </div>
        <div className="demo-body">
          <p className="demo-hint">Type a note on the first product, tick <b>Gift</b>, bump its quantity… then change the list.</p>
          <KeyedList key={round} mode={mode} />
        </div>
        <p className="demo-note">{NOTE[mode]}</p>
      </section>

      <ReconcileLog />
      <CodePeek
        title={mode === 'index' ? 'Trap: the key is the position' : mode === 'id' ? 'Pattern: the key is the product' : 'Double trap: a new key every render'}
        file="src/KeyedList.tsx"
        code={mode === 'index' ? INDEX_CODE : mode === 'id' ? ID_CODE : RANDOM_CODE}
      />
      {mode === 'id' && <CodePeek title="Bonus: use the same rule on purpose" file="src/ProductForm.tsx" code={RESET_CODE} />}
    </div>
  );
}
