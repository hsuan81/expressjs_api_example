const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  realname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cellphone: {
    type: Number,
    required: true
  },
  departmentId: {
    type: Number,
    required: true
  },
  roleId: {
    type: Number,
    required: true
  },
  refreshToken: {
    type: String
  }
});

module.exports = mongoose.model('User', UserSchema);
