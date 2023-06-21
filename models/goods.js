const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoodsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  oldPrice: {
    type: Number,
    required: true
  },
  newPrice: {
    type: Number,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  inventoryCount: {
    type: Number,
    required: true
  },
  saleCount: {
    type: Number,
    required: true
  },
  favorCount: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Goods', GoodsSchema);
