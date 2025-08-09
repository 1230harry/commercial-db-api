// src/routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  const { sku, name, description, category_id, supplier_id, price, cost } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (sku, name, description, category_id, supplier_id, price, cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sku, name, description, category_id, supplier_id, price, cost]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { sku, name, description, category_id, supplier_id, price, cost } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE products SET sku = ?, name = ?, description = ?, category_id = ?, supplier_id = ?, price = ?, cost = ? WHERE id = ?',
      [sku, name, description, category_id, supplier_id, price, cost, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route to get all products with category and supplier details
// GET /api/products/full-details
router.get('/full-details', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        p.id, p.sku, p.name, p.description, p.price, p.cost,
        c.name AS category_name,
        s.name AS supplier_name
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      INNER JOIN suppliers s ON p.supplier_id = s.id`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching products with full details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
