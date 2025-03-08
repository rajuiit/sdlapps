
const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    headline: { type: String, required: true },
    content: { type: String },
    publishDate: { type: Date },
});

module.exports = mongoose.model('News', newSchema);
