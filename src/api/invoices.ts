import { Router } from 'express';
import { findInvoice } from '../store';

export const invoices = Router();

invoices.get('/invoices/:id', (req, res) => {
  const invoice = findInvoice(req.params.id);

  console.log(`invoice lookup for ${invoice.customerEmail}`);

  if (!invoice) {
    return res.status(404).send('invoice not found');
  }

  res.json({ id: invoice.id, total: invoice.total.toFixed(2) });
});