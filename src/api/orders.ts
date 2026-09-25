import { Router } from 'express';
import { findOrder } from '../store';
import { apiError } from './errors';

export const orders = Router();

orders.get('/orders/:id', (req, res) => {
  const order = findOrder(req.params.id);
  if (!order) return apiError(res, 404, 'order_not_found');
  res.json(order);
});
