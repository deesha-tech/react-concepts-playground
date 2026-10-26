// The key lines shown under the demo. Lines starting with "!" are highlighted.
export const TRAP_CODE = `
!const [loading, setLoading] = useState(false);
!const [error, setError] = useState(null);

async function handleSubmit(e) {
!  e.preventDefault();
!  setLoading(true);
  try {
    onAdded(await postReview(comment, rating));
    setComment('');
  } catch (err) {
    setError(err.message);
  } finally {
!    setLoading(false);
  }
}
<button type="submit">{loading ? 'Posting…' : 'Post review'}</button>
`;

export const ACTION_CODE = `
!const [state, formAction] = useActionState(async (prev, data) => {
  try {
    onAdded(await postReview(data.get('comment'), data.get('rating')));
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
}, { error: null });

!<form action={formAction}> … <SubmitButton /> </form>

function SubmitButton() {
!  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Posting…' : 'Post review'}</button>;
}
`;

export const OPTIMISTIC_CODE = `
!const [shown, addOptimistic] = useOptimistic(reviews, (list, r) => [r, ...list]);

const [state, formAction] = useActionState(async (prev, data) => {
!  addOptimistic({ comment: data.get('comment'), sending: true });   // on screen now
  try {
    onAdded(await postReview(data.get('comment'), data.get('rating')));
    return { error: null };
  } catch (e) {
!    return { error: e.message };   // React removes the optimistic review
  }
}, { error: null });
`;
