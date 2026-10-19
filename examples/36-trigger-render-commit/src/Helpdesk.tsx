// The helpdesk: App → Header, SideNav, MainPanel → TicketCard.
// All state lives in App, so every trigger is a state update in App, and React renders App and everything below it.
//
// The only lines that aren't plain React are the demo hooks: useTrack() reports "React called me", and the
// handlers call recordTrigger() before their setter so the "Watch it" card knows what started the update.
import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { FILTERS, INCOMING, STARTING_TICKETS, countByStatus, visibleTickets, type Filter, type Status, type Ticket } from './data';
import { controls, flushCommit, recordTrigger, registerRoot, trackRender, type AppSnapshot } from './instrument';

/** false inside the before/after pictures, so drawing them isn't counted as a render of the real app */
const Tracking = createContext(true);
function useTrack(name: string, id: string) {
  if (useContext(Tracking)) trackRender(name, id); // demo only: "React just called this component"
}

interface Handlers {
  pick: (f: Filter) => void;
  type: (value: string) => void;
  setStatus: (id: number, status: Status) => void;
}

const STATUSES: Status[] = ['open', 'in-progress', 'resolved'];

// ---------------------------------------------------------------------------------------------------------
// The components. Each one is a function that returns a description of its part of the screen.

function Header({ openCount, syncedAgo }: { openCount: number; syncedAgo: number }) {
  useTrack('Header', 'header');
  return (
    <header className="hd-header" data-comp="Header" data-comp-id="header">
      <strong>Helpdesk</strong>
      <span className="hd-opencount">{openCount} open</span>
      <span className="hd-sync">{syncedAgo === 0 ? 'synced just now' : `synced ${syncedAgo}s ago`}</span>
    </header>
  );
}

function SideNav({ filter, tickets, on }: { filter: Filter; tickets: Ticket[]; on: Handlers | null }) {
  useTrack('SideNav', 'sidenav');
  return (
    <nav className="hd-nav" data-comp="SideNav" data-comp-id="sidenav" aria-label="Ticket filters">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={f.value === filter ? 'is-active' : ''}
          aria-pressed={f.value === filter}
          data-filter={f.value}
          disabled={!on}
          onClick={() => on?.pick(f.value)}
        >
          {f.label}
          <span className="hd-count">{f.value === 'all' ? tickets.length : countByStatus(tickets, f.value)}</span>
        </button>
      ))}
    </nav>
  );
}

function TicketCard({ ticket, on }: { ticket: Ticket; on: Handlers | null }) {
  useTrack('TicketCard', `t${ticket.id}`);
  return (
    <li className="hd-card" data-comp="TicketCard" data-comp-id={`t${ticket.id}`}>
      <span className="hd-id">#{ticket.id}</span>
      <span className="hd-title">{ticket.title}</span>
      <span className="hd-customer">{ticket.customer}</span>
      {on ? (
        <select
          className={`hd-status hd-${ticket.status}`}
          value={ticket.status}
          aria-label={`Status of ticket ${ticket.id}`}
          onChange={(e) => on.setStatus(ticket.id, e.target.value as Status)}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
        </select>
      ) : (
        <span className={`hd-status hd-${ticket.status}`}>{ticket.status.replace('-', ' ')}</span>
      )}
    </li>
  );
}

function MainPanel({ tickets, query, on }: { tickets: Ticket[]; query: string; on: Handlers | null }) {
  useTrack('MainPanel', 'mainpanel');
  return (
    <section className="hd-main" data-comp="MainPanel" data-comp-id="mainpanel">
      <input
        className="hd-search"
        placeholder="Search tickets… try “password”"
        value={query}
        readOnly={!on}
        onChange={(e) => on?.type(e.target.value)}
        aria-label="Search tickets"
      />
      {tickets.length === 0 ? <p className="hd-empty">No tickets match.</p> : (
        <ul className="hd-list">{tickets.map((t) => <TicketCard key={t.id} ticket={t} on={on} />)}</ul>
      )}
    </section>
  );
}

/** The same tree for the live app and for the before/after pictures. */
function helpdesk(snap: AppSnapshot, on: Handlers | null) {
  return (
    <>
      <Header openCount={countByStatus(snap.tickets, 'open')} syncedAgo={snap.syncedAgo} />
      <div className="hd-body">
        <SideNav filter={snap.filter} tickets={snap.tickets} on={on} />
        <MainPanel tickets={visibleTickets(snap.tickets, snap.filter, snap.query)} query={snap.query} on={on} />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------
// App: owns the state. Every trigger below ends in one of these setters.

export function HelpdeskApp() {
  useTrack('App', 'app');
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>(STARTING_TICKETS);
  const [syncedAgo, setSyncedAgo] = useState(0);
  const [version, setVersion] = useState(0); // nothing on screen uses this: the "same data" bonus

  // Triggers: something happens, some code calls a setter. React doesn't redraw yet, it schedules a render.
  const on: Handlers = {
    pick: (f) => {
      recordTrigger({ kind: 'click', label: `Click · ${FILTERS.find((x) => x.value === f)?.label}`, code: `setFilter('${f}')` });
      setFilter(f);
    },
    type: (value) => {
      recordTrigger({ kind: 'keystroke', label: `Keystroke · "${value}"`, code: `setQuery('${value}')` });
      setQuery(value);
    },
    setStatus: (id, status) => {
      recordTrigger({ kind: 'click', label: `Status · #${id} → ${status.replace('-', ' ')}`, code: `setTickets((all) => all.map((t) =>\n  t.id === ${id} ? { ...t, status: '${status}' } : t))` });
      setTickets((all) => all.map((t) => (t.id === id ? { ...t, status } : t)));
    },
  };
  const serverReply = () => {
    const incoming = INCOMING[(tickets.length - STARTING_TICKETS.length) % INCOMING.length];
    const ticket = { ...incoming, id: Math.max(...tickets.map((t) => t.id)) + 1 };
    recordTrigger({ kind: 'server', label: 'Server reply · new ticket', code: 'setTickets((all) => [...all, newTicket])\nsetSyncedAgo(0)' });
    setTickets((all) => [...all, ticket]); // two setters in one event…
    setSyncedAgo(0);                       // …React batches them into ONE render
  };
  const timerTick = () => {
    recordTrigger({ kind: 'timer', label: 'Timer · 5 seconds later', code: 'setSyncedAgo((s) => s + 5)' });
    setSyncedAgo((s) => s + 5);
  };
  const sameData = () => {
    recordTrigger({ kind: 'same', label: 'Re-render · same data', code: 'setVersion((v) => v + 1) // nothing on screen uses it' });
    setVersion((v) => v + 1);
  };

  // ---- demo wiring (not part of the lesson) -------------------------------------------------------------
  const rootRef = useRef<HTMLDivElement>(null);
  const snap = useRef<AppSnapshot>({ filter, query, tickets, syncedAgo, version });
  useLayoutEffect(() => registerRoot(rootRef.current!, () => snap.current), []);
  useLayoutEffect(() => {
    snap.current = { filter, query, tickets, syncedAgo, version };
    controls.click = () => on.pick(filter === 'open' ? 'all' : 'open');
    controls.keystroke = () => on.type('password'.startsWith(query) && query.length < 8 ? 'password'.slice(0, query.length + 1) : 'p'); // one letter of "password" per press
    controls.server = serverReply;
    controls.timer = timerTick;
    controls.same = sameData;
    flushCommit(); // the DOM is updated now: record what changed
  });
  // -------------------------------------------------------------------------------------------------------

  return (
    <div ref={rootRef} className="hd" data-comp="App" data-comp-id="app">
      {helpdesk({ filter, query, tickets, syncedAgo }, on)}
    </div>
  );
}

/** A static picture of the helpdesk for one state, used by "spot the difference". Not counted as a render. */
export function HelpdeskPicture({ snap }: { snap: AppSnapshot }) {
  return (
    <Tracking.Provider value={false}>
      <div className="hd hd-picture" data-comp="App" data-comp-id="app" aria-hidden="true">{helpdesk(snap, null)}</div>
    </Tracking.Provider>
  );
}

/** Mounts the helpdesk. "Reload" gives it a new key, which throws it away and mounts it again: a first render. */
export function HelpdeskHost() {
  const [round, setRound] = useState(0);
  useLayoutEffect(() => {
    controls.reload = () => {
      recordTrigger({ kind: 'first', label: 'Reload · first render', code: 'createRoot(el).render(<App />)' });
      setRound((r) => r + 1);
    };
  }, []);
  return <HelpdeskApp key={round} />;
}
