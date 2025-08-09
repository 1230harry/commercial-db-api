// src/routes/inventory.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all inventory records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventory');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET inventory for a specific product
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM inventory WHERE product_id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching inventory for product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET inventory for a specific warehouse
router.get('/warehouses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM inventory WHERE warehouse_id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching inventory for warehouse:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST a new inventory record
router.post('/', async (req, res) => {
  const { product_id, warehouse_id, quantity } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES (?, ?, ?)',
      [product_id, warehouse_id, quantity]
    );
    res.status(201).json({ id: result.insertId, message: 'Inventory record created successfully' });
  } catch (error) {
    console.error('Error creating inventory record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT to update an inventory record
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const [result] = await db.query('UPDATE inventory SET quantity = ? WHERE id = ?', [quantity, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inventory record not found' });
    }
    res.status(200).json({ message: 'Inventory record updated successfully' });
  } catch (error) {
    console.error('Error updating inventory record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE an inventory record
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM inventory WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Inventory record not found' });
    }
    res.status(200).json({ message: 'Inventory record deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route to get all inventory records with product and warehouse names
// GET /api/inventory/full-details
router.get('/full-details', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        i.id, i.quantity,
        p.name AS product_name, p.sku AS product_sku,
        w.name AS warehouse_name, w.location AS warehouse_location
      FROM inventory i
      INNER JOIN products p ON i.product_id = p.id
      INNER JOIN warehouses w ON i.warehouse_id = w.id`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching inventory with full details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route to get all inventory records with product and warehouse names
// Now supports filtering and pagination
// GET /api/inventory/full-details?page=<number>&limit=<number>&product_name=<string>
router.get('/full-details', async (req, res) => {
  try {
    const { page, limit, product_name } = req.query;

    // --- Pagination Logic ---
    // Set defaults if not provided
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNumber - 1) * pageSize;

    // --- Filtering Logic ---
    const filters = [];
    const params = [];
    if (product_name) {
      filters.push('p.name LIKE ?');
      // The '%' is a wildcard for partial matching
      params.push(`%${product_name}%`);
    }

    // Build the SQL query dynamically
    let sqlQuery = `
      SELECT
        i.id, i.quantity,
        p.name AS product_name, p.sku AS product_sku,
        w.name AS warehouse_name, w.location AS warehouse_location
      FROM inventory i
      INNER JOIN products p ON i.product_id = p.id
      INNER JOIN warehouses w ON i.warehouse_id = w.id
    `;

    if (filters.length > 0) {
      sqlQuery += ' WHERE ' + filters.join(' AND ');
    }
    
    // Add pagination to the query
    sqlQuery += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    const [rows] = await db.query(sqlQuery, params);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error fetching inventory with full details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
