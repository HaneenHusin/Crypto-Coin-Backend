const axios = require('axios');

const getCryptoPrices = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'bitcoin,ethereum', 
          vs_currencies: 'eur',
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
