// src/routes/suppliers.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suppliers');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single supplier by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching supplier by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new supplier
router.post('/', async (req, res) => {
  const { name, contact_email, contact_phone } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO suppliers (name, contact_email, contact_phone) VALUES (?, ?, ?)',
      [name, contact_email, contact_phone]
    );
    res.status(201).json({ id: result.insertId, message: 'Supplier created successfully' });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update a supplier
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact_email, contact_phone } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE suppliers SET name = ?, contact_email = ?, contact_phone = ? WHERE id = ?',
      [name, contact_email, contact_phone, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(200).json({ message: 'Supplier updated successfully' });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a supplier
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM suppliers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
