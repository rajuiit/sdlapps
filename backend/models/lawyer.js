const mongoose = require('mongoose');
const LawyerSchema = new mongoose.Schema({
  fullName:  { type: String, required: true },
  barId:     String,
  specialty: String,
  email:     String,
  phone:     String
}, { timestamps: true });
module.exports = mongoose.model('Lawyer', LawyerSchema);
