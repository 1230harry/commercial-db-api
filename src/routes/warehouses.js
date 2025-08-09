// src/routes/warehouses.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all warehouses
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM warehouses');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single warehouse by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM warehouses WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching warehouse by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new warehouse
router.post('/', async (req, res) => {
  const { name, location } = req.body;
  try {
    const [result] = await db.query('INSERT INTO warehouses (name, location) VALUES (?, ?)', [name, location]);
    res.status(201).json({ id: result.insertId, message: 'Warehouse created successfully' });
  } catch (error) {
    console.error('Error creating warehouse:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update a warehouse
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;
  try {
    const [result] = await db.query('UPDATE warehouses SET name = ?, location = ? WHERE id = ?', [name, location, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json({ message: 'Warehouse updated successfully' });
  } catch (error) {
    console.error('Error updating warehouse:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a warehouse
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM warehouses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.status(200).json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
