// src/app.js
const express = require('express');
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const customersRouter = require('./routes/customers');
const addressesRouter = require('./routes/addresses');
const categoriesRouter = require('./routes/categories');
const suppliersRouter = require('./routes/suppliers');
const inventoryRouter = require('./routes/inventory');
const order_itemsRouter = require('./routes/orderItems');
const paymentsRouter = require('./routes/payments');
const warehousesRouter = require('./routes/warehouses');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
    });
// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});


// Main route
app.get('/', (req, res) => {
  res.send('Welcome to the Commercial DB API!');
});

// Use the routers for their respective routes
app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/order-items', order_itemsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/warehouses', warehousesRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
