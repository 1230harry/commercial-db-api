// src/routes/order_items.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all order items
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM order_items');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single order item by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM order_items WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching order item by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new order item
router.post('/', async (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [order_id, product_id, quantity, price]
    );
    res.status(201).json({ id: result.insertId, message: 'Order item created successfully' });
  } catch (error) {
    console.error('Error creating order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update an order item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity, price } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE order_items SET quantity = ?, price = ? WHERE id = ?',
      [quantity, price, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.status(200).json({ message: 'Order item updated successfully' });
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE an order item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM order_items WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.status(200).json({ message: 'Order item deleted successfully' });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
