// The key lines shown under the demo. Lines starting with "!" are highlighted.
export const TRAP_CODE = `
!const [product, setProduct] = useState(null);
!const [loading, setLoading] = useState(true);
!const [error, setError] = useState(null);

useEffect(() => {
  let ignore = false;           // runs AFTER the first (empty) render
!  getProduct(id)
    .then((p) => { if (!ignore) setProduct(p); })
    .catch((e) => { if (!ignore) setError(e); })
    .finally(() => { if (!ignore) setLoading(false); });
  return () => { ignore = true; };
}, [id]);

if (loading) return <Spinner />;
if (error) return <Problem />;
`;

export const USE_CODE = `
// the promise is created when the user clicks, not while rendering
!const [promise, setPromise] = useState(() => getProduct(id));
const pick = (id) => setPromise(getProduct(id));

<ErrorBoundary>
!  <Suspense fallback={<Skeleton />}>
    <UseProduct promise={promise} />
  </Suspense>
</ErrorBoundary>

function UseProduct({ promise }) {
!  const product = use(promise);   // no useState, no useEffect
  return <ProductView product={product} />;
}
`;

export const LOOP_CODE = `
function LoopProduct({ id }) {
!  const product = use(getProduct(id));   // ✕ a new promise on every render
  return <ProductView product={product} />;
}
// render → new promise → suspend → React tries again
// → new promise → another request → … forever.
// Create the promise outside render: in an event, a loader, or a cache.
`;
