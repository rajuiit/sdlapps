const mongoose = require('mongoose');
const ClientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true },
  phone:    String,
  address:  String
}, { timestamps: true });
module.exports = mongoose.model('Client', ClientSchema);
