const express = require('express');
const router = express.Router();
const { 
  getAllCoins, 
  addCoin, 
  deleteCoin, 
  editCoin, 
  getTotalValue, 
  fetchWeeklyChange 
} = require('../controllers/coinController');


router.get('/', getAllCoins);
router.post('/', addCoin);
router.delete('/:id', deleteCoin);
router.post('/:id', editCoin);
router.get('/total-value', getTotalValue);
router.get('/fetchWeeklyChange', fetchWeeklyChange);

module.exports = router;
