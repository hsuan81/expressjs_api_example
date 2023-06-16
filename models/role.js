const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  intro: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Role', RoleSchema);
