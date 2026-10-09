import { useRenderMark } from './useRenderMark';

/** Shows what the user typed next to what the screen is actually showing. */
export function Results({ typed, resultsFor, items, error }: { typed: string; resultsFor: string; items: string[]; error?: Error | null }) {
  useRenderMark(resultsFor ? `Screen shows results for "${resultsFor}"` : 'Screen is empty');
  const match = !resultsFor || resultsFor === typed;
  return (
    <div className="search-results">
      <div className={`search-status ${resultsFor ? (match ? 'is-ok' : 'is-bad') : ''}`}>
        <span>You typed <code>{typed || '…'}</code></span>
        <span>Screen shows results for <code>{resultsFor || '…'}</code></span>
        {resultsFor && <strong>{match ? '✓ correct' : '✕ wrong results'}</strong>}
      </div>
      {error && <p className="tag-bad">{error.message}</p>}
      <ul>
        {items.map((name) => <li key={name}>{name}</li>)}
        {resultsFor && items.length === 0 && <li className="muted">No products match.</li>}
      </ul>
    </div>
  );
}
