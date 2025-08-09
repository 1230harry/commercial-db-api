// src/app.js
const express = require('express');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const customersRouter = require('./routes/customers');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Main route
app.get('/', (req, res) => {
  res.send('Welcome to the Commercial DB API!');
});

// Use the routers for their respective routes
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
