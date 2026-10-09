import { createRoot } from 'react-dom/client';
import { App } from './App';

// StrictMode is deliberately off here. In development it runs every effect twice (that's Ep 07),
// which would show each useEffect request twice in the timeline and blur the comparison.
createRoot(document.getElementById('root')!).render(<App />);
