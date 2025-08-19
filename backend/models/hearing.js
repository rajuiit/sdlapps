const mongoose = require('mongoose');
const HearingSchema = new mongoose.Schema({
  case:     { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  date:     { type: Date, required: true },
  court:    String,
  location: String,
  notes:    String
}, { timestamps: true });
module.exports = mongoose.model('Hearing', HearingSchema);
