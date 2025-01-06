const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const getCryptoPrices = require('./utils/cryptoPrices');
const app = express();
require('dotenv').config();
app.use(express.static('public'));

// Apply CORS middleware for local test
const corsOptions = {
  origin: ['http://localhost:3001', 'https://crypto-dashboard-test.netlify.app'], // Add the Netlify URL here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions)); 


app.use(bodyParser.json());

// Connect to MongoDB using the correct URI
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello, Coin Portfolio API!');
});

// Start server
 const PORT = process.env.PORT || 3000; ;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Other routes for coins and portfolio
const Coin = require('./models/Coin');

app.get('/api/coins', async (req, res) => {
  const coins = await Coin.find();
  res.json(coins);
});

app.post('/api/coins', async (req, res) => {
  const coin = new Coin(req.body);
  await coin.save();
  res.json(coin);
});

app.delete('/api/coins/:id', async (req, res) => {
  await Coin.findByIdAndDelete(req.params.id);
  res.json({ message: 'Coin deleted' });
});



app.post('/api/coins/:id', async (req, res) => {
  try {
    const updatedCoin = await Coin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCoin) {
      return res.status(404).json({ message: 'Coin not found' });
    }
    res.json(updatedCoin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit coin' });
  }
});

app.get('/api/coins/total-value', async (req, res) => {
  try {
    const portfolio = await Coin.find();

   
    const currentPrices = await getCryptoPrices();

    if (!currentPrices || !portfolio) {
      throw new Error('Missing data for calculation');
    }

   
    const totalValue = portfolio.reduce((sum, entry) => {
      const currentPrice = currentPrices[entry.name.toLowerCase()]?.eur || 0; // Safely access the price
      console.log(`Coin: ${entry.name}, Quantity: ${entry.quantity}, Current Price: ${currentPrice}`);
      return sum + (entry.quantity * currentPrice);
    }, 0);

    res.json({ totalValue });
  } catch (error) {
    console.error('Error calculating total value:', error);
    res.status(500).json({ error: 'Failed to calculate total value.' });
  }
});
