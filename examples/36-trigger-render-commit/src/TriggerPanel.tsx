// Four everyday triggers (plus the first render and a bonus). Every one of them ends in a state setter.
import { controls, setSlow, useLog } from './instrument';

const TRIGGERS = [
  { key: 'keystroke', icon: '⌨️', label: 'Keystroke', sub: 'types the next letter of “password”' },
  { key: 'click', icon: '🖱️', label: 'Click', sub: 'picks a filter in the sidebar' },
  { key: 'server', icon: '🌐', label: 'Server reply', sub: 'a new ticket arrives' },
  { key: 'timer', icon: '⏱️', label: 'Sync timer', sub: '“synced 5s ago” ticks' },
] as const;

export function TriggerPanel() {
  const { slow } = useLog();
  return (
    <div className="triggers">
      <div className="trig-row" role="group" aria-label="Triggers">
        {TRIGGERS.map((t) => (
          <button key={t.key} className={`trig trig-${t.key}`} onClick={() => controls[t.key]?.()}>
            <span className="trig-icon" aria-hidden="true">{t.icon}</span>
            <span><b>{t.label}</b><small>{t.sub}</small></span>
          </button>
        ))}
      </div>
      <div className="trig-extra">
        <button className="btn btn-reload" onClick={() => controls.reload?.()}>↻ Reload (first render)</button>
        <button className="btn btn-same" onClick={() => controls.same?.()}>Bonus · re-render with the same data</button>
        <label className="slow-toggle"><input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /> Slow-motion replay</label>
      </div>
    </div>
  );
}
