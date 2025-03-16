const Event = require('../models/Event');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('creator', 'name email');
        const eventsRes = events.map(event => ({
            ...event.toObject(),
            isEditable: event.creator._id.toString() === req.user.id
        }));
        res.json(eventsRes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

const createEvent = async (req, res) => {
    const { name, description, location, date } = req.body;
    try {
        const id = crypto.randomUUID().toString();
        const event = await Event.create({
            id,
            name,
            description,
            location,
            date,
            creator: req.user.id
        });
        const savedEvent = await event.populate('creator', 'name email');
        const eventRes = {
            ...savedEvent.toObject(),
            isEditable: true
        };
        res.status(201).json(eventRes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, date } = req.body;
        
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }
        
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { name, description, location, date },
            { new: true }
        ).populate('creator', 'name email');

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.remove();
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

const register = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate('creator participants', 'name email');
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.participants 
            && event.participants.some(participant => participant._id.toString() === req.user.id)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }
        
        event.participants.push(req.user.id);
        await event.save();

        const updatedEvent = await event.populate('creator participants', 'name email');
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error registering for event', error: error.message });
    }
};

module.exports = { 
    getEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    register 
};