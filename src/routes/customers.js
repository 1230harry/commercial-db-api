// src/routes/customers.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM customers');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single customer by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new customer
router.post('/', async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, phone]
    );
    res.status(201).json({ id: result.insertId, message: 'Customer created successfully' });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing customer
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?',
      [first_name, last_name, email, phone, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
