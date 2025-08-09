// src/routes/payments.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all payments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM payments');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single payment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM payments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new payment
router.post('/', async (req, res) => {
  const { order_id, amount, payment_date, payment_method, transaction_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO payments (order_id, amount, payment_date, payment_method, transaction_id) VALUES (?, ?, ?, ?, ?)',
      [order_id, amount, payment_date, payment_method, transaction_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Payment created successfully' });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update a payment
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { payment_status } = req.body; // Example: only updating status
  try {
    const [result] = await db.query('UPDATE payments SET payment_status = ? WHERE id = ?', [payment_status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment updated successfully' });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a payment
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM payments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
