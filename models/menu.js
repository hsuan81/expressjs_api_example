const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  sort: {
    type: Number,
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId
  },
});

module.exports = mongoose.model('Menu', MenuSchema);
