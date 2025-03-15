const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/events', protect, getEvents);
router.post('/events', protect, createEvent);
router.put('/events/:id', protect, updateEvent);
router.delete('/events/:id', protect, deleteEvent);

module.exports = router;
