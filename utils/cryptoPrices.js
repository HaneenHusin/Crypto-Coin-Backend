const axios = require('axios');
require('dotenv').config();

const getCryptoPrices = async () => {
  try {
    const response = await axios.get(
      `${process.env.COINGECKO_BASE_URL}/simple/price`,
      {
        params: {
          ids: 'bitcoin,ethereum',
          vs_currencies: 'eur',
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw new Error('Failed to fetch live prices.');
  }
};

module.exports = getCryptoPrices;
