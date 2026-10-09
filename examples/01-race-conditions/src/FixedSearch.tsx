// FIXED VERSION: when the query changes, React runs the cleanup of the previous effect,
// which aborts the previous request. Only the latest request can update the state.
import { useEffect, useState } from 'react';
import { searchProducts } from './api';
import { Results } from './Results';

export function FixedSearch({ query, typed }: { query: string; typed: string }) {
  const [results, setResults] = useState<string[]>([]);
  const [resultsFor, setResultsFor] = useState('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    searchProducts(query, controller.signal)
      .then((res) => {
        setResults(res.items);
        setResultsFor(res.query);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return; // cancelling is expected, not an error
        setError(e as Error);
      });
    return () => controller.abort(); // runs before the next effect, and on unmount
  }, [query]);

  return <Results typed={typed} resultsFor={resultsFor} items={results} error={error} />;
}
