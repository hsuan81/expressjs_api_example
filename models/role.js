const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  menuList: [{
      type: Schema.Types.ObjectId,
      ref: 'Menu'
  }]
});

module.exports = mongoose.model('Role', RoleSchema);
