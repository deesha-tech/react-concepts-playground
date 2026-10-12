import { createRoot } from 'react-dom/client';
import { App } from './App';

// StrictMode is deliberately off here. In development it runs state initialisers and effects twice (that's Ep 07),
// which would make the instance numbers in the rows jump by two and blur the comparison.
createRoot(document.getElementById('root')!).render(<App />);
