// The key lines shown under the demo. Lines starting with "!" are highlighted.
export const JUNIOR_CODE = `
!const [product, setProduct] = useState<Product | null>(null);
!const [loading, setLoading] = useState(true);
!const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  // runs AFTER the first (empty) render
  getProduct(productId)
    .then(setProduct)
    .catch(setError)
    .finally(() => setLoading(false));
}, [productId]);

!if (loading) return <Loading />;   // spinner #1
if (error) return <Problem />;

return (
  <ProductView product={product}>
!    <JuniorReviews />   // mounts now, fetches now: spinner #2
  </ProductView>
);
`;

export const SENIOR_CODE = `
// router: the route owns its data
{ path: 'senior/products/:productId',
!  loader: productLoader,
  Component: SeniorProductPage,
!  ErrorBoundary: SeniorProductError,
!  children: [{ index: true, loader: reviewsLoader, Component: SeniorReviews }] }

// runs BEFORE render, in parallel with reviewsLoader
export async function productLoader({ params, request }) {
!  return getProduct(params.productId, request.signal);
}

export function SeniorProductPage() {
  // no useState · no useEffect · no loading flag
!  const product = useLoaderData<typeof productLoader>(); // already here
  return <ProductView product={product}><Outlet /></ProductView>;
}
`;
