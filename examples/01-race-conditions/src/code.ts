// The key lines shown under the demo. Lines starting with "!" are highlighted.
export const BUGGY_CODE = `
useEffect(() => {
  if (!query) return;
  searchProducts(query).then((res) => {
!    setResults(res.items);   // whichever response arrives LAST wins
    setResultsFor(res.query);
  });
!}, [query]);                  // no cleanup: old requests keep running
`;

export const FIXED_CODE = `
useEffect(() => {
  if (!query) return;
!  const controller = new AbortController();
!  searchProducts(query, controller.signal)
    .then((res) => {
      setResults(res.items);
      setResultsFor(res.query);
    })
    .catch((e) => {
!      if (e.name === 'AbortError') return;   // cancelling is expected
      setError(e);
    });
!  return () => controller.abort();          // runs when the query changes
}, [query]);
`;

export const DEBOUNCE_CODE = `
export function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
!    const timer = setTimeout(() => setDebounced(value), ms);
!    return () => clearTimeout(timer);   // typing again cancels the pending update
  }, [value, ms]);
  return debounced;
}

// in the component
!const query = useDebouncedValue(text, 400);
`;
