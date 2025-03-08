import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import NewsForm from '../components/NewsForm';
import NewsList from '../components/NewsList';
import { useAuth } from '../context/AuthContext';

const News = () => {
  const { user } = useAuth();
  const [newsItems, setNewsItems] = useState([]);
  const [editingNews, setEditingNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axiosInstance.get('/api/news', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setNewsItems(response.data);
      } catch (error) {
        alert('Failed to fetch news.');
      }
    };

    fetchNews();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <NewsForm
        newsItems={newsItems}
        setNewsItems={setNewsItems}
        editingNews={editingNews}
        setEditingNews={setEditingNews}
      />
      <NewsList newsItems={newsItems} setNewsItems={setNewsItems} setEditingNews={setEditingNews} />
    </div>
  );
};

export default News;