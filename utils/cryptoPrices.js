const axios = require('axios');

const getCryptoPrices = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'bitcoin,ethereum,tether', 
                vs_currencies: 'eur',
            },
            headers: {
                'accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'x-cg-demo-api-key': 'CG-UpUDgPbX2ZqJRN7ipFmYLTAb'
              }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        throw error;
    }
};

module.exports = getCryptoPrices;
