const express = require('express');
const axios = require('axios');
const router = express.Router();

const COINGECKO_URL = 'https://api.coingecko.com/api/v3';

router.get('/weekly-change', async (req, res) => {
  try {
    // Fetch current prices
    const [bitcoinResponse, ethereumResponse] = await Promise.all([
      axios.get(`${COINGECKO_URL}/simple/price`, {
        params: { ids: 'bitcoin', vs_currencies: 'eur' },
      }),
      axios.get(`${COINGECKO_URL}/simple/price`, {
        params: { ids: 'ethereum', vs_currencies: 'eur' },
      }),
    ]);

    const bitcoinCurrentPrice = bitcoinResponse.data.bitcoin.eur;
    const ethereumCurrentPrice = ethereumResponse.data.ethereum.eur;

    // Fetch historical prices (7 days ago)
    const [bitcoinHistoryResponse, ethereumHistoryResponse] = await Promise.all([
      axios.get(`${COINGECKO_URL}/coins/bitcoin/market_chart`, {
        params: { vs_currency: 'eur', days: 7 },
      }),
      axios.get(`${COINGECKO_URL}/coins/ethereum/market_chart`, {
        params: { vs_currency: 'eur', days: 7 },
      }),
    ]);

    const bitcoinOldPrice = bitcoinHistoryResponse.data.prices[0][1];
    const ethereumOldPrice = ethereumHistoryResponse.data.prices[0][1];

    // Calculate percentage changes
    const bitcoinChange = ((bitcoinCurrentPrice - bitcoinOldPrice) / bitcoinOldPrice) * 100;
    const ethereumChange = ((ethereumCurrentPrice - ethereumOldPrice) / ethereumOldPrice) * 100;

    // Send response
    res.json({
      bitcoin: bitcoinChange.toFixed(2),
      ethereum: ethereumChange.toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching weekly change data:', error);
    res.status(500).json({ error: 'Failed to fetch weekly change data' });
  }
});

module.exports = router;
