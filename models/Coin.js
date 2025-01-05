const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  name: { type: String, required: true },       
  quantity: { type: Number, required: true }, 

  purchasePrice: { type: Number, required: true},
  purchaseTime: { type:Date, required: true},
});

module.exports = mongoose.model('Coin', coinSchema);
