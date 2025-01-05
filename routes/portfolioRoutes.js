const express = require('express');
const Coin = require('../models/Coin'); // Or your specific model
const getCryptoPrices = require('../utils/cryptoPrices'); // Utility function for prices

const router = express.Router();

router.get('/total-value', async (req, res) => {
  try {
    const portfolio = await Coin.find(); // Replace 'Coin' if it's the wrong model
    const currentPrices = await getCryptoPrices();

    const totalValue = portfolio.reduce((sum, entry) => {
      const currentPrice = currentPrices[entry.name.toLowerCase()]?.eur || 0;
      return sum + entry.quantity * currentPrice;
    }, 0);

    res.json({ totalValue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate total value.' });
  }
});

module.exports = router;
