
const express = require('express');
const { getEvents, createEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/events', protect, getEvents);
router.post('/events',protect, createEvent);

module.exports = router;
