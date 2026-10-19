import { createRoot } from 'react-dom/client';
import { App } from './App';

// StrictMode is deliberately off here. In development it calls every component twice (that's Ep 07),
// which would double every count in the render lane and blur the lesson.
createRoot(document.getElementById('root')!).render(<App />);
