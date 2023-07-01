const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// function requiredAllowEmptyString (field) {
//   return typeof this.field === 'string'? false : true
// }

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  realname: {
    type: String,
    required: function() {
      typeof this.realname === 'string'? false : true
    }
  },
  password: {
    type: String,
    required: true
  },
  cellphone: {
    type: Number,
    required: true,
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
