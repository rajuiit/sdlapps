const News = require('../models/New');

const getNews = async (req, res) => {
    try {
        const news = await News.find({ userId: req.user.id });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addNews = async (req, res) => {
    const { headline, content, publishDate } = req.body;
    try {
        const news = await News.create({ userId: req.user.id, headline, content, publishDate });
        res.status(201).json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateNews = async (req, res) => {
    const { headline, content, publishDate } = req.body;
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });
        news.headline = headline || news.headline;
        news.content = content || news.content;
        news.publishDate = publishDate || news.publishDate;
        const updatedNews = await news.save();
        res.json(updatedNews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'News not found' });
        await news.remove();
        res.json({ message: 'News deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNews, addNews, updateNews, deleteNews };