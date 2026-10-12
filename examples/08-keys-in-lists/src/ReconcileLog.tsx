// "2 · Watch it": what React did to the real DOM after each action, and which component instance now
// shows which product. A row is flagged when the instance (and its state) was created for a different product.
import { useReconcileLog, type LogEntry } from './reconcile';

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

function Summary({ e }: { e: LogEntry }) {
  const parts = [
    e.mounted ? `${plural(e.mounted, 'row')} mounted` : '',
    e.unmounted ? `${plural(e.unmounted, 'row')} unmounted` : '',
    e.moved ? `${plural(e.moved, 'row')} moved` : '',
    e.updated ? `${plural(e.updated, 'text/attribute update')}` : '',
  ].filter(Boolean);
  return (
    <li className={`rl-entry ${e.unmounted > 0 && e.instances > 1 ? 'rl-heavy' : ''}`}>  {/* rows thrown away and rebuilt */}
      <span className="rl-action">{e.action}</span>
      <span className="rl-dom">{parts.length ? parts.join(' · ') : 'DOM untouched'}</span>
      {e.instances > 0 && <span className="rl-inst">{plural(e.instances, 'new instance')}</span>}
    </li>
  );
}

export function ReconcileLog() {
  const { entries, rows } = useReconcileLog();
  const stale = rows.filter((r) => r.bornFor !== r.item).length;
  return (
    <section className="demo-card" aria-label="Reconciliation log" data-stage="watch">
      <div className="demo-head"><span className="stage-tag">2 · Watch it</span><h2>Reconciliation log</h2><span className="tl-live"><i />live</span></div>
      <div className="demo-body">
        {rows.length === 0 ? (
          <p className="tl-empty">Change the list above and every DOM change React makes shows up here.</p>
        ) : (
          <>
            <table className="rl-rows">
              <thead><tr><th>Row</th><th>Product shown</th><th>Instance created for</th><th>Note</th><th>Gift</th><th>Qty</th></tr></thead>
              <tbody>
                {rows.map((r, i) => {
                  const wrong = r.bornFor !== r.item;
                  return (
                    <tr key={i} className={wrong ? 'rl-wrong' : ''}>
                      <td>{i + 1}</td>
                      <td>{r.item}</td>
                      <td><span className="rl-badge">#{r.instance}</span> {wrong ? <s>{r.bornFor}</s> : 'this product'}{wrong && <strong> ✕</strong>}</td>
                      <td>{r.note || <span className="muted">—</span>}</td>
                      <td>{r.gift ? '✓' : <span className="muted">—</span>}</td>
                      <td>{r.qty}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={`rl-verdict ${stale ? 'rl-verdict-bad' : 'rl-verdict-ok'}`}>
              {stale
                ? `${plural(stale, 'row')} showing state that belongs to a different product: React matched rows by position, not by product.`
                : 'Every row shows its own state: React matched rows by product.'}
            </p>
            {entries.length > 0 && <ol className="rl-log">{entries.map((e) => <Summary key={e.id} e={e} />)}</ol>}
          </>
        )}
      </div>
    </section>
  );
}
