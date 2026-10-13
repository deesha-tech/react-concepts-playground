import { useState } from 'react';
import { createBrowserRouter, Link, Outlet, useLocation, useNavigate, useNavigation, useOutletContext } from 'react-router';
import { RouterProvider } from 'react-router/dom'; // v8: RouterProvider lives in react-router/dom
import { PlaygroundShell } from './shell/PlaygroundShell';
import { RequestTimeline } from './shell/RequestTimeline';
import { CodePeek } from './shell/CodePeek';
import { timeline } from './shell/timeline';
import { EPISODE } from './episode';
import { PRODUCTS } from './data';
import { network } from './api';
import { EffectProductPage } from './junior/JuniorProductPage';
import { productLoader, reviewsLoader, LoaderProductError, LoaderProductPage, LoaderReviews } from './senior/routes';
import { EFFECT_CODE, LOADER_CODE } from './code';
import './demo.css';

type Mode = 'effect' | 'loader';

const router = createBrowserRouter([
  {
    path: '/',
    Component: DemoLayout,
    HydrateFallback: () => null,
    children: [
      { index: true, Component: ProductList },
      // TRAP: no loader. The component fetches its own data in useEffect.
      { path: 'effect/products/:productId', Component: EffectProductPage },
      // PATTERN: the route owns the data. Parent and nested loaders run in parallel.
      {
        path: 'loader/products/:productId',
        loader: productLoader,
        Component: LoaderProductPage,
        ErrorBoundary: LoaderProductError,
        children: [{ index: true, loader: reviewsLoader, Component: LoaderReviews }],
      },
    ],
  },
]);

export function App() {
  return (
    <PlaygroundShell episode={EPISODE}>
      <RouterProvider router={router} />
    </PlaygroundShell>
  );
}

function modeFromPath(pathname: string): Mode | null {
  if (pathname.startsWith('/effect')) return 'effect';
  if (pathname.startsWith('/loader')) return 'loader';
  return null;
}

/** Wraps the mini store: mode switch, network speed, the "browser" frame, timeline and code. */
function DemoLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [chosen, setChosen] = useState<Mode>(() => modeFromPath(location.pathname) ?? 'effect');
  const mode = modeFromPath(location.pathname) ?? chosen;
  const [speed, setSpeed] = useState(network.speed);
  const productPath = location.pathname.match(/products\/[^/]+/)?.[0];

  const switchMode = (next: Mode) => {
    setChosen(next);
    if (productPath) {
      timeline.reset(`Switched to ${next} and reopened the product`);
      navigate(`/${next}/${productPath}`);
    }
  };
  const replay = () => {
    if (!productPath) return;
    timeline.reset('Replay: opened the product again');
    navigate(`/${mode}/${productPath}`);
  };

  return (
    <div className="demo">
      <section className="demo-card" data-stage="try">
        <div className="demo-head">
          <span className="stage-tag">1 · Try it</span>
          <div className="seg" role="group" aria-label="Data loading approach">
            <button aria-pressed={mode === 'effect'} onClick={() => switchMode('effect')}>Trap · useEffect</button>
            <button className="seg-good" aria-pressed={mode === 'loader'} onClick={() => switchMode('loader')}>Pattern · loader</button>
          </div>
          <div className="demo-tools">
            <label className="muted">
              Network{' '}
              <select value={speed} onChange={(e) => { network.speed = Number(e.target.value); setSpeed(network.speed); }}>
                <option value={1}>Normal</option>
                <option value={2}>Slow</option>
              </select>
            </label>
            <button className="btn" onClick={replay} disabled={!productPath}>↻ Replay</button>
          </div>
        </div>

        <div className="browser">
          <div className="browser-bar">
            <span className="dots" aria-hidden><i /><i /><i /></span>
            <span className="browser-url">shop.example{location.pathname === '/' ? '/' : location.pathname}</span>
          </div>
          {/* Pending UI: a global progress bar while loaders run */}
          <div className={`browser-progress ${navigation.state !== 'idle' ? 'is-loading' : ''}`} aria-hidden />
          <div className="browser-page">
            {/* Also shown while a navigation is pending, so you can leave mid-load and watch the loaders get cancelled */}
            {(location.pathname !== '/' || navigation.state !== 'idle') && <Link className="back" to="/">← All products</Link>}
            {/* key: replaying the same URL remounts the useEffect page, like a fresh visit */}
            <div key={location.key}><Outlet context={mode} /></div>
          </div>
        </div>
        {mode === 'loader' && (
          <p className="demo-note">
            Notice the old page stays on screen while the loaders run, with a progress bar on top. That's <code>useNavigation()</code>. Then the page appears complete, in one go.
          </p>
        )}
        {mode === 'effect' && (
          <p className="demo-note">
            The page appears instantly, but empty. Each part then fetches for itself, so the reviews wait for the product. That staircase in the timeline is a <strong>request waterfall</strong>.
          </p>
        )}
      </section>

      <RequestTimeline />
      <CodePeek title={mode === 'effect' ? 'Trap: fetching in useEffect' : 'Pattern: a route loader'} file={mode === 'effect' ? 'src/junior/JuniorProductPage.tsx' : 'src/senior/routes.tsx'} code={mode === 'effect' ? EFFECT_CODE : LOADER_CODE} />
    </div>
  );
}

function ProductList() {
  const mode = useOutletContext<Mode>();
  const open = (name: string) => timeline.reset(`Click: open ${name}`);
  return (
    <div>
      <h3 className="shop-title">All products</h3>
      <div className="shop-grid">
        {PRODUCTS.map((p) => (
          <Link key={p.id} className="shop-card" to={`/${mode}/products/${p.id}`} onClick={() => open(p.name)}>
            <img className="shop-thumb" src={p.image} alt="" />
            <span>{p.name}</span>
          </Link>
        ))}
        <Link className="shop-card shop-card-broken" to={`/${mode}/products/999`} onClick={() => open('a missing product')}>
          <span className="shop-emoji" aria-hidden>❓</span>
          <span>A product that doesn't exist</span>
        </Link>
      </div>
      <p className="muted shop-tip">Tip: open a product, then click "All products" before it finishes loading.</p>
    </div>
  );
}
