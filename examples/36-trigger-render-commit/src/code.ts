// The key lines shown under the demo. Lines starting with "!" are highlighted.
export const THREE_STEPS_CODE = `
// 1 · TRIGGER: a click, a keystroke, a server reply, a timer… all end in a state setter
!<input value={query} onChange={(e) => setQuery(e.target.value)} />
!<button onClick={() => setFilter('open')}>Open</button>
!api.newTicket().then((t) => setTickets((all) => [...all, t]));
!setInterval(() => setSyncedAgo((s) => s + 5), 5000);
// The setter doesn't redraw anything. It tells React: "render again, soon".

// 2 · RENDER: React calls your components, top down. Each returns a description.
function SideNav({ filter }: { filter: Filter }) {
  return (
    <nav>
      {FILTERS.map((f) => (
!        <button aria-pressed={f.value === filter}>{f.label}</button>
      ))}
    </nav>
  );
}
// React compares the new description with the previous one (reconciliation).

// 3 · COMMIT: React applies only the differences to the real DOM.
//   Typing "p":  App, Header, SideNav, MainPanel + 3 TicketCards render (7)
//                only MainPanel changes: the input, and 2 cards removed (1 place)
//   Header and SideNav rendered, and their DOM wasn't touched at all.
`;
