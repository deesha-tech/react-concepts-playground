import { PlaygroundShell } from './shell/PlaygroundShell';
import { CodePeek } from './shell/CodePeek';
import { EPISODE } from './episode';
import { HelpdeskHost } from './Helpdesk';
import { Stage } from './Stage';
import { TriggerPanel } from './TriggerPanel';
import { WatchIt } from './WatchIt';
import { THREE_STEPS_CODE } from './code';
import './demo.css';

export function App() {
  return (
    <PlaygroundShell episode={EPISODE}>
      <RenderDemo />
    </PlaygroundShell>
  );
}

// No state here on purpose: if this component re-rendered, it would re-render the helpdesk too and pollute the counts.
function RenderDemo() {
  return (
    <div className="demo">
      <section className="demo-card" data-stage="try">
        <div className="demo-head"><span className="stage-tag">1 · Try it</span><h2>Four triggers, one helpdesk</h2></div>
        <div className="demo-body">
          <TriggerPanel />
          <Stage><HelpdeskHost /></Stage>
        </div>
        <p className="demo-note">You can also use the helpdesk directly: click a filter or type in the search box. Every interaction goes through the same three steps.</p>
      </section>

      <WatchIt />
      <CodePeek title="The three steps, in code" file="src/Helpdesk.tsx" code={THREE_STEPS_CODE} />
    </div>
  );
}
