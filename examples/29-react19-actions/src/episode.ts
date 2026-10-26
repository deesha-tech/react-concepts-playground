import type { Episode } from './shell/types';

export const EPISODE: Episode = {
  n: 29,
  slug: '29-react19-actions',
  title: 'React 19 Actions',
  layout: 'drawer',
  pattern: 'Form actions',
  type: 'React Concept',
  summary: 'Post a review the React 18 way: four useStates, a try/catch/finally, and a button that posts twice when you double click. Then let React 19 run the submit as an Action: pending, errors and the form reset are handled for you, and useOptimistic shows the review before the server answers.',
  concepts: ['Actions', 'useActionState', 'useFormStatus', 'useOptimistic', 'Form reset'],
  steps: [
    'Keep "Trap" selected. Write a review and click "Post review" twice, quickly. The timeline shows two POST requests, and the review appears twice.',
    'Post a review that is too short. The error appears. Now post a proper one: it saves, but the old error is still there.',
    'Switch to "Pattern" and do the same. The button disables itself while posting, so a double click sends one request. The error clears on the next try, and the form resets after a success.',
    'Switch to "Bonus" and post again. The review appears instantly as "sending…". Post a short one and watch it appear, then disappear when the server rejects it.',
  ],
  challenges: [
    { level: 'Warm-up', text: 'In the Trap version, fix the double submit and the stale error with the least code you can. Count the lines you added, then compare with the Pattern version.' },
    { level: 'Core', text: 'Add a "Clear" button inside the Pattern form that is disabled while the review is posting, using useFormStatus and no props.' },
    { level: 'Stretch', text: 'Add a star rating summary above the reviews that updates optimistically in the Bonus version, and rolls back on its own when a review is rejected.' },
  ],
  tour: [
    { target: '.rf-text', title: 'Write a review', text: 'Type a short review of the iPhone 13 Pro. This is the React 18 way: the text, the rating, loading and error are all useState.' },
    { target: '.rf-submit', title: 'Now click twice, quickly', text: 'Click "Post review" two times in a row, before the first one finishes.' },
    { target: "section[aria-label='Network and render timeline']", title: 'Two requests', text: 'Two POST requests went out, because nothing disabled the button. Look at the reviews: yours is there twice.' },
    { target: '.demo-card[data-code]', title: 'All of this is yours to maintain', text: 'loading, error, preventDefault, try/catch/finally, and you still forgot to disable the button and to clear the error.' },
    { target: '.seg button:nth-of-type(2)', title: 'Switch to the pattern', text: 'Use a React 19 form action.', action: 'click', after: 400 },
    { target: '.rf-submit', title: 'Click twice again', text: 'Write a review and double click "Post review". The button disables itself the moment the action starts.' },
    { target: "section[aria-label='Network and render timeline']", title: 'One request', text: 'One POST. React knows the form is pending, and useFormStatus lets the button read that without any props.' },
    { target: '.demo-card[data-code]', title: 'The whole submit, in one action', text: 'useActionState runs your async function and gives you its result. No loading state, no error state, and the form resets after a success.' },
    { target: '.seg button:nth-of-type(3)', title: 'One more: useOptimistic', text: 'Show the review before the server answers.', action: 'click', after: 400 },
    { target: '.pr-list', title: 'Instant, then confirmed', text: 'Post a review: it appears right away as "sending…". Post one that is too short: it appears, then React removes it when the server says no.' },
    { target: '.pg-drawer-pill', title: 'Your turn', text: 'Three challenges on form actions wait behind this button: your own repository, a trainer review, points and a leaderboard.' },
    { target: '.pg-iv-teaser', title: 'Ready for the interview', text: 'Read how to explain Actions, useActionState and useFormStatus in an interview.' },
  ],
  challenge: 'Add a "Clear" button inside the Pattern form that is disabled while the review is posting, using useFormStatus and no props.',
  interview: {
    question: 'What are Actions in React 19, and what do useActionState and useFormStatus give you over a classic onSubmit handler?',
    answer: [
      "An Action is an async function that React runs inside a transition. The simplest way to use one is to pass it to a form: <form action={fn}>. React calls it with the form's FormData, keeps the form in a pending state while it runs, and resets the form's uncontrolled fields when it finishes successfully. You don't call preventDefault, and you don't need a loading flag.",
      "useActionState wraps that function and gives you its last result, the action to pass to the form, and an isPending flag. So the error message is simply what the action returns: if it fails, return { error }; if it succeeds, return the new state. No separate useState for loading or error, and nothing to forget to reset.",
      "useFormStatus is for components inside the form, usually the submit button. It reads the pending status of the parent form without props, so the button can disable itself and show 'Posting…'. That alone removes the classic double-submit bug where the button stays clickable while the request is in flight.",
      "On top of that, useOptimistic shows the expected result immediately, like a new review marked 'sending…', and React throws the optimistic value away when the action finishes, whether it succeeded or not. With the classic onSubmit you build all of this by hand: four pieces of state, a try/catch/finally, and the cleanup you have to remember.",
    ],
    short: "An Action is an async function React runs in a transition, like <form action={fn}>. useActionState gives you its result and a pending flag, so errors are just return values and you write no loading or error state. useFormStatus lets the submit button read the form's pending state, which stops double submits. The form resets after a success, and useOptimistic can show the result before the server answers.",
    followUps: [
      {
        q: 'Do Actions only work with forms?',
        a: "No. Any async function passed to startTransition is an Action, and useActionState works with a button's formAction too. Forms are just the most natural fit, because React gets the FormData and the reset for free.",
      },
      {
        q: 'Why did the form keep my text when the server returned an error?',
        a: "React resets uncontrolled fields after the action. To keep what the user typed on an error, return it in the state and use it as the field's defaultValue, remounting the field with a key so the new default applies.",
      },
      {
        q: 'Is useFormStatus the same as the isPending from useActionState?',
        a: "They describe the same submission, from different places. isPending is available where you call useActionState. useFormStatus works in any component rendered inside the form, without passing props, which is why it's ideal for a reusable submit button.",
      },
      {
        q: 'When would you still use a classic onSubmit handler?',
        a: "When you need to stop the submit before it starts, for example client-side validation that blocks it, or when the form is fully controlled and you already have the values in state. Even then, wrapping the async work in startTransition gives you the pending state for free.",
      },
    ],
  },
  videoUrl: '',
};
