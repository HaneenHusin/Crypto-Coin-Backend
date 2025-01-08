require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const coinRoutes = require('./routes/coinRoutes');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3001', 'https://crypto-dashboard-test.netlify.app'] }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Database Connection
connectDB();

// Routes
app.use('/api/coins', coinRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello, Coin Portfolio API!');
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
