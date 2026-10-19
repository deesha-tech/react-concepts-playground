import type { Episode } from './shell/types';

export const EPISODE: Episode = {
  n: 36,
  slug: '36-trigger-render-commit',
  title: 'Trigger → Render → Commit',
  layout: 'drawer',
  pattern: 'Render is a function call; commit is the DOM',
  type: 'React Concept',
  summary: 'Everyone says "React re-renders"… but what actually happens between typing a letter and your screen updating? A keystroke, a click, a server reply and a timer all go through the same three steps. Fire each one and watch which components React calls, and what really changes on the page.',
  concepts: ['Trigger', 'Render phase', 'Reconciliation', 'Commit phase', 'Batching', 'Pure components'],
  steps: [
    'Tick "Show components" and "Show state": every box is a component, and all the state lives in App. Guess: typing one letter in the search box makes React run how many components?',
    'Type "p" in the search box. Amber boxes light up in the order React calls each component: that is the render. The lanes below count them.',
    'Watch the teal flash: only the ticket list really changed in the DOM. The header and the sidebar rendered and were not touched. Press "Play" in Spot the difference to see why.',
    'Try the other triggers: a click on a filter, a server reply (two setters, one render), a timer. Then the bonus: re-render with the same data, and watch the commit do nothing.',
  ],
  challenges: [
    { level: 'Warm-up', text: 'Press "Server reply". It calls two setters, setTickets and setSyncedAgo, yet the render lane shows one pass. Explain why, then make it render twice on purpose and say what that costs.' },
    { level: 'Core', text: 'Move the selected filter out of App and into the components that need it so that clicking Open no longer renders Header. Count the renders before and after, and explain what you traded.' },
    { level: 'Stretch', text: 'Add a component that writes to document.title during render. Turn on StrictMode, watch it misbehave, then move the write to the right place and explain why render must stay pure.' },
  ],
  tour: [
    { target: '.boxes-toggle', title: 'Every box is a component', text: 'Tick “Show components”. Each dashed box is one component: App, Header, SideNav, MainPanel and one TicketCard per ticket.' },
    { target: '.stage-bar', title: 'Where the state lives', text: 'Tick “Show state”. All the state lives in App: the filter, the search query, the tickets and the sync timer. Guess first: typing one letter makes React run how many components?' },
    { target: '.hd-search', title: 'The trigger', text: 'Type the letter “p”. The input calls setQuery(\'p\'). That is the trigger: React schedules a render, nothing has changed yet.', action: 'event', event: 'pg-update-recorded', after: 900 },
    { target: '.lane-render', title: 'The render', text: 'React called seven components: App and everything below it. Rendering means calling your functions. Each returned a description of its part of the screen.' },
    { target: '.lane-commit', title: 'The commit', text: 'Only one place changed in the real DOM: the ticket list in MainPanel. Header and SideNav rendered, and nothing in them changed.' },
    { target: '.spot-play', title: 'Spot the difference', text: 'React compares the old description with the new one. Press Play and try to beat it.', action: 'click', after: 3000 },
    { target: '.trig-server', title: 'A different trigger', text: 'A server reply calls two setters. Click it and count the renders: React batches both into one.', action: 'click', after: 1200 },
    { target: '.btn-same', title: 'The bonus', text: 'Re-render with the same data. Everything renders… and the commit changes nothing. A re-render is a function call, not a repaint.', action: 'click', after: 1400 },
    { target: '.demo-card[data-code]', title: 'The three steps in code', text: 'Every trigger ends in a setter. Render calls your components. Commit applies only the differences.' },
    { target: '.pg-drawer-pill', title: 'Your turn', text: 'Three challenges on this concept wait behind this button: your own repository, a trainer review, points and a leaderboard.' },
    { target: '.pg-iv-teaser', title: 'Ready for the interview', text: 'Read how to explain trigger, render and commit in an interview, with the follow-up questions interviewers like to ask.' },
  ],
  challenge: 'Move the selected filter out of App so that clicking Open no longer renders Header. Count the renders before and after, and explain what you traded.',
  interview: {
    question: 'What happens in React between a user clicking a button that calls setState and the screen updating?',
    answer: [
      "Three steps: trigger, render, commit. The trigger is the state update. Whatever happened, a click, a keystroke, a response from the server, a timer, it ends with some code calling a state setter. The setter doesn't change anything on screen. It queues the update and schedules a render. Only two things ever start a render: the initial render when the app mounts, and a state update. A parent re-rendering or a context value changing is a state update somewhere above.",
      "In the render phase React calls the component whose state changed and, by default, every component below it. Rendering means calling your component functions. Each returns JSX, which is a description of what that part of the screen should look like, not the DOM itself. React then compares the new description with the previous one. That comparison is reconciliation. Because React can call components at any time, and twice in Strict Mode, render has to be pure: same props and state, same output, no side effects.",
      "In the commit phase React applies only the differences to the real DOM: it inserts, removes and updates the nodes that changed. A component can render and produce exactly the same output, and then the commit doesn't touch its DOM at all. After the commit the browser paints, and then effects run, which is why a useEffect can read the updated DOM.",
      "Two details interviewers like. Several setters in one event are batched into a single render. And a re-render is not a repaint: it's a function call, usually cheap. The expensive part is the DOM, and React keeps the commit to the minimum. So 'it re-rendered' on its own is never the problem; I measure before I optimise.",
    ],
    short: "A state update triggers a render. In the render phase React calls the component and everything below it, and each returns a description of its UI; React compares it with the previous one, which is reconciliation. In the commit phase it applies only the differences to the DOM, then the browser paints and effects run. Render must be pure, setters in one event are batched, and a re-render is a function call, not a repaint.",
    followUps: [
      {
        q: 'Does calling setState update the DOM immediately?',
        a: "No. It queues an update and schedules a render. Inside the same event handler the state variable still holds the old value, because it's a snapshot of that render. React renders after the handler finishes, batching every update from that event into one pass.",
      },
      {
        q: 'If a component re-renders, does React update its DOM?',
        a: "Only if its output changed. React compares the new description with the previous one, and the commit touches only what differs. A component can render with the same props and produce the same JSX, and its DOM is left completely alone.",
      },
      {
        q: 'Why does React insist that components are pure?',
        a: "Because React decides when and how often to call them: it can render, throw the result away, and render again, and Strict Mode calls them twice on purpose in development. If rendering changed something outside the component, like a variable, the document title or a network request, those side effects would happen an unpredictable number of times. Side effects belong in event handlers or effects, which run after the commit.",
      },
      {
        q: 'When do effects run relative to the commit?',
        a: "After it. useLayoutEffect runs right after React updates the DOM, before the browser paints. useEffect runs after the paint. Either way the DOM is already up to date, which is why effects can measure or read it.",
      },
    ],
  },
  videoUrl: '',
};
