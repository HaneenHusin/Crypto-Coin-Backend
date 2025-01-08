const Coin = require('../models/Coin');
const coinService = require('../services/coinService');

// Get all coins
exports.getAllCoins = async (req, res) => {
  try {
    const coins = await Coin.find();
    res.json(coins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
};

// Add a new coin
exports.addCoin = async (req, res) => {
  try {
    const coin = new Coin(req.body);
    await coin.save();
    res.json(coin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add coin' });
  }
};

// Delete a coin
exports.deleteCoin = async (req, res) => {
  try {
    await Coin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coin deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coin' });
  }
};

// Edit a coin
exports.editCoin = async (req, res) => {
  try {
    const updatedCoin = await Coin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCoin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit coin' });
  }
};

// Get total value
exports.getTotalValue = async (req, res) => {
  try {
    const totalValue = await coinService.calculateTotalValue();
    res.json({ totalValue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate total value' });
  }
};

// Fetch weekly change
exports.fetchWeeklyChange = async (req, res) => {
  try {
    const changes = await coinService.getWeeklyChange();
    res.json(changes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weekly change' });
  }
};
