import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const NewsForm = ({ newsItems, setNewsItems, editingNews, setEditingNews }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ headline: '', content: '', publishDate: '' });

  useEffect(() => {
    if (editingNews) {
      setFormData({
        headline: editingNews.headline,
        content: editingNews.content,
        publishDate: editingNews.publishDate,
      });
    } else {
      setFormData({ headline: '', content: '', publishDate: '' });
    }
  }, [editingNews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        const response = await axiosInstance.put(`/api/news/${editingNews._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setNewsItems(newsItems.map((news) => (news._id === response.data._id ? response.data : news)));
      } else {
        const response = await axiosInstance.post('/api/news', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setNewsItems([...newsItems, response.data]);
      }
      setEditingNews(null);
      setFormData({ headline: '', content: '', publishDate: '' });
    } catch (error) {
      alert('Failed to save news.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingNews ? 'Edit News' : 'Create News'}</h1>
      <input
        type="text"
        placeholder="Headline"
        value={formData.headline}
        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        rows="4"
      />
      <input
        type="date"
        value={formData.publishDate}
        onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingNews ? 'Update News' : 'Create News'}
      </button>
    </form>
  );
};

export default NewsForm;