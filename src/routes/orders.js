// src/routes/orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Route to get all orders
// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a single order by its ID
// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all order items for a specific order ID
// GET /api/orders/:id/items
router.get('/:id/items', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new order
// POST /api/orders
router.post('/', async (req, res) => {
  const { customer_id, total, shipping_address_id, billing_address_id } = req.body;
  try {
    // You would typically handle order items and total calculation here
    const [result] = await db.query(
      'INSERT INTO orders (customer_id, total, shipping_address_id, billing_address_id) VALUES (?, ?, ?, ?)',
      [customer_id, total, shipping_address_id, billing_address_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update an existing order
// PUT /api/orders/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Example: only allowing status to be updated
  try {
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete an order
// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
