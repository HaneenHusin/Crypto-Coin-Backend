const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3', 
    headers: {
        'accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-cg-demo-api-key': 'CG-UpUDgPbX2ZqJRN7ipFmYLTAb', 
    },
});

module.exports = axiosInstance;
