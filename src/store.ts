export interface Order {
  id: string;
  total: number;
}

export interface Invoice {
  id: string;
  customerEmail: string;
  total: number;
}

const orders: Record<string, Order> = {
  'o-1': { id: 'o-1', total: 42.5 },
};

const invoices: Record<string, Invoice> = {
  'inv-1': { id: 'inv-1', customerEmail: 'pat@example.com', total: 99.99 },
};

export function findOrder(id: string): Order | undefined {
  return orders[id];
}

export function findInvoice(id: string): Invoice | undefined {
  return invoices[id];
}
