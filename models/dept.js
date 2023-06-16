const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeptSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  parentId: {
    type: Number,
    required: true
  },
  leader: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Department', DeptSchema);
