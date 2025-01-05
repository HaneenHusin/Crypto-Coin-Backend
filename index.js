const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const getCryptoPrices = require('./utils/cryptoPrices');
const app = express();

// Apply CORS middleware
app.use(cors({ origin: 'http://localhost:3001', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type'] }));


app.options('*', cors());


app.use(bodyParser.json());



// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/coin-portfolio')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello, Coin Portfolio API!');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Additional routes
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

app.get('/api/portfolio/total-value', async (req, res) => {
  try {
    const portfolio = await Coin.find(); 
    const currentPrices = await getCryptoPrices();
    const totalValue = portfolio.reduce((sum, entry) => {
      const currentPrice = currentPrices[entry.name.toLowerCase()]?.eur || 0;
      return sum + entry.quantity * currentPrice;
    }, 0);
    res.json({ totalValue });
  } catch (error) {
    console.error('Error calculating total value:', error);
    res.status(500).json({ error: 'Failed to calculate total value.' });
  }
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
