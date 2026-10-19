// The helpdesk's data. Plain TypeScript, no React.

export type Status = 'open' | 'in-progress' | 'resolved';
export type Filter = 'all' | Status;

export interface Ticket {
  id: number;
  title: string;
  customer: string;
  status: Status;
}

export const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
];

export const STARTING_TICKETS: Ticket[] = [
  { id: 1042, title: 'Cannot log in after password reset', customer: 'Northwind Traders', status: 'open' },
  { id: 1043, title: 'Invoice shows the wrong VAT rate', customer: 'Contoso Ltd', status: 'open' },
  { id: 1044, title: 'CSV export times out', customer: 'Fabrikam Inc', status: 'in-progress' },
  { id: 1045, title: 'Feature request: dark mode', customer: 'Adventure Works', status: 'open' },
  { id: 1046, title: 'Update the billing address', customer: 'Tailspin Toys', status: 'resolved' },
];

/** Tickets the "server" sends when you press "Server reply". */
export const INCOMING: Omit<Ticket, 'id'>[] = [
  { title: 'Password reset email never arrives', customer: 'Wide World Importers', status: 'open' },
  { title: 'Refund not showing on the statement', customer: 'Litware Inc', status: 'open' },
  { title: 'Mobile app crashes on upload', customer: 'Proseware', status: 'open' },
];

export function visibleTickets(tickets: Ticket[], filter: Filter, query: string): Ticket[] {
  const q = query.trim().toLowerCase();
  return tickets.filter((t) => (filter === 'all' || t.status === filter) && (!q || t.title.toLowerCase().includes(q)));
}

export const countByStatus = (tickets: Ticket[], status: Status) => tickets.filter((t) => t.status === status).length;
