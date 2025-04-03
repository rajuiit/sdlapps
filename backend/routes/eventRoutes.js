const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent, register, unregister } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/events', protect, getEvents);
router.post('/events', protect, createEvent);
router.put('/events/:id', protect, updateEvent);
router.delete('/events/:id', protect, deleteEvent);
router.post('/events/register/:id', protect, register);
router.post('/events/unregister/:id', protect, unregister);

module.exports = router;
