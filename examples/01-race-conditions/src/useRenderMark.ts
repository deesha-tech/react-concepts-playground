import { useEffect } from 'react';
import { timeline } from './shell/timeline';

/** Records "this screen was shown" on the timeline. Only for the demo's visualisation. */
export function useRenderMark(label: string) {
  useEffect(() => { timeline.mark(label); }, [label]);
}
