const axiosInstance = require('../utils/axiosInstance');
const Coin = require('../models/Coin');

exports.calculateTotalValue = async () => {
  const portfolio = await Coin.find();
  const currentPrices = await axiosInstance.get('/simple/price', {
    params: { ids: 'bitcoin,ethereum', vs_currencies: 'eur' },
  });

  return portfolio.reduce((sum, entry) => {
    const price = currentPrices.data[entry.name.toLowerCase()]?.eur || 0;
    return sum + entry.quantity * price;
  }, 0);
};

exports.getWeeklyChange = async () => {
  const [bitcoinCurrent, bitcoinHistory, ethereumCurrent, ethereumHistory] = await Promise.all([
    axiosInstance.get('/simple/price', { params: { ids: 'bitcoin', vs_currencies: 'eur' } }),
    axiosInstance.get('/coins/bitcoin/market_chart', { params: { vs_currency: 'eur', days: 7 } }),
    axiosInstance.get('/simple/price', { params: { ids: 'ethereum', vs_currencies: 'eur' } }),
    axiosInstance.get('/coins/ethereum/market_chart', { params: { vs_currency: 'eur', days: 7 } }),
  ]);

  const bitcoinChange = ((bitcoinCurrent.data.bitcoin.eur - bitcoinHistory.data.prices[0][1]) / bitcoinHistory.data.prices[0][1]) * 100;
  const ethereumChange = ((ethereumCurrent.data.ethereum.eur - ethereumHistory.data.prices[0][1]) / ethereumHistory.data.prices[0][1]) * 100;

  return {
    bitcoin: bitcoinChange.toFixed(2),
    ethereum: ethereumChange.toFixed(2),
  };
};
