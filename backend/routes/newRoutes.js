const express = require('express');
const { getNews, addNews, updateNews, deleteNews } = require('../controllers/newsController');

const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getNews).post(protect, addNews);
router.route('/:id').put(protect, updateNews).delete(protect, deleteNews);

module.exports = router;