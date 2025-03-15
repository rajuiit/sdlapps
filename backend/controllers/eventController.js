const Event = require('../models/Event');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

const createEvent = async (req, res) => {
    const { name, description, location, date } = req.body;
        try {
            const id = crypto.randomUUID().toString();
            const event = await Event.create({ id, name, description, location, date });
            res.status(201).json({ id: event.id, name: event.name, description: event.description, location: event.location, date: event.date });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, date } = req.body;
        
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { name, description, location, date },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

module.exports = { getEvents, createEvent, updateEvent };