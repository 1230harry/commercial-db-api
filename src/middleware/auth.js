const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        req.user = decoded; // { id: ..., admin: ... }
        next();
    });
}

// Middleware to check admin role
function isAdmin(req, res, next) {
    if (!req.user || !req.user.admin) {
        return res.status(403).json({ error: 'Admin access only' });
    }
    next();
}

module.exports = { verifyToken, isAdmin };
