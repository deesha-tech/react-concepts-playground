// BUGGY VERSION: one request per keystroke, and no cleanup.
// Whichever response arrives LAST wins, even if it belongs to an older query.
import { useEffect, useState } from 'react';
import { searchProducts } from './api';
import { Results } from './Results';

export function BuggySearch({ query, typed }: { query: string; typed: string }) {
  const [results, setResults] = useState<string[]>([]);
  const [resultsFor, setResultsFor] = useState('');

  useEffect(() => {
    if (!query) return;
    searchProducts(query).then((res) => {
      setResults(res.items); // an old, slow response can land here last
      setResultsFor(res.query);
    });
  }, [query]);

  return <Results typed={typed} resultsFor={resultsFor} items={results} />;
}
