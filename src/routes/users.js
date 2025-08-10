const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
    const { fullname, email, contact, username, password, admin } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (fullname, email, contact, username, password, admin) VALUES (?, ?, ?, ?, ?, ?)',
            [fullname, email, contact, username, hashedPassword, admin || false]
        );
        res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, admin: user.admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, admin: user.admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN-ONLY ROUTE
router.get('/admin-dashboard', verifyToken, isAdmin, (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard', user: req.user });
});

module.exports = router;
