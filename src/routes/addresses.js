// src/routes/addresses.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all addresses
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM addresses');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single address by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM addresses WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching address by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new address
router.post('/', async (req, res) => {
  const { street, city, state, postal_code, country } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO addresses (street, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?)',
      [street, city, state, postal_code, country]
    );
    res.status(201).json({ id: result.insertId, message: 'Address created successfully' });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update an address
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { street, city, state, postal_code, country } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE addresses SET street = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE id = ?',
      [street, city, state, postal_code, country, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE an address
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM addresses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
