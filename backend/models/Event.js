const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Event', eventSchema);
