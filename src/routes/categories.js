// src/routes/categories.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a single category by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update a category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const [result] = await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
