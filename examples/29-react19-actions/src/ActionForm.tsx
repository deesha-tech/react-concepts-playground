// PATTERN: React 19 Actions. The form calls an async function; React tracks pending, the result and the reset.
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { postReview, type Review } from './api';
import { timeline } from './shell/timeline';
import { Stars } from './TrapForm';

type State = { error: string | null; comment?: string; attempt: number };

export function ActionForm({ onAdded }: { onAdded: (r: Review) => void }) {
  const [state, formAction] = useActionState(async (prev: State, data: FormData): Promise<State> => {
    const comment = String(data.get('comment') ?? '');
    try {
      onAdded(await postReview(comment, Number(data.get('rating') ?? 5)));
      return { error: null, attempt: prev.attempt + 1 };            // success: React resets the form
    } catch (e) {
      return { error: (e as Error).message, comment, attempt: prev.attempt + 1 };   // keep what they typed
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

/** Any button inside the form can read its status: no props, no loading state. */
export function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="btn btn-primary rf-submit" type="submit" disabled={pending}>{pending ? 'Posting…' : 'Post review'}</button>;
}
