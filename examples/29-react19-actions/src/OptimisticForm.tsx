// BONUS: useOptimistic. The review shows up instantly, then is confirmed, or rolled back if the server says no.
import { useActionState, useOptimistic } from 'react';
import { postReview, type Review } from './api';
import { timeline } from './shell/timeline';
import { Stars } from './TrapForm';
import { SubmitButton } from './ActionForm';

type State = { error: string | null; comment?: string; attempt: number };

export function useOptimisticReviews(reviews: Review[]) {
  return useOptimistic(reviews, (current: Review[], pending: Review) => [pending, ...current]);
}

export function OptimisticForm({ onAdded, addOptimistic }: { onAdded: (r: Review) => void; addOptimistic: (r: Review) => void }) {
  const [state, formAction] = useActionState(async (prev: State, data: FormData): Promise<State> => {
    const comment = String(data.get('comment') ?? '');
    const rating = Number(data.get('rating') ?? 5);
    addOptimistic({ id: -Date.now(), rating, comment, reviewerName: 'You', sending: true });   // on screen right now
    try {
      onAdded(await postReview(comment, rating));
      return { error: null, attempt: prev.attempt + 1 };
    } catch (e) {
      return { error: (e as Error).message, comment, attempt: prev.attempt + 1 };   // the optimistic review disappears by itself
    }
  }, { error: null, attempt: 0 });

  return (
    <form className="rf" action={formAction} onSubmit={() => timeline.mark('Click: Post review')}>
      <Stars name="rating" />
      <textarea key={state.attempt} className="rf-text" name="comment" defaultValue={state.comment} placeholder="Write a review…" aria-label="Review" />
      <div className="rf-foot">
        <SubmitButton />
        {state.error && <p className="rf-error">{state.error}</p>}
      </div>
    </form>
  );
}
