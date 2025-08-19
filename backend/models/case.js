const mongoose = require('mongoose');
const CaseSchema = new mongoose.Schema({
  caseNumber:     { type: String, required: true, unique: true },
  title:          { type: String, required: true },
  description:    String,
  status:         { type: String, enum: ['Open','In Progress','Closed'], default: 'Open' },
  client:         { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  assignedLawyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' },
  filingDate:     Date,
  closingDate:    Date
}, { timestamps: true });
module.exports = mongoose.model('Case', CaseSchema);
