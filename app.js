const express = require('express');
const app = express();
const port = 4000;

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

// Middleware to parse JSON bodies
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Basic Route: Home
app.get('/', (req, res) => {
  res.send('Welcome to the Basic Express.js App!');
});

app.use('/api/auth' , authRoutes);
app.use('/api/products' , productRoutes);

// Catch-all for undefined routes (404 Not Found)
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist!");
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});