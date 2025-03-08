import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const NewsList = ({ newsItems, setNewsItems, setEditingNews }) => {
  const { user } = useAuth();

  const handleDelete = async (newsId) => {
    try {
      await axiosInstance.delete(`/api/news/${newsId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNewsItems(newsItems.filter((news) => news._id !== newsId));
    } catch (error) {
      alert('Failed to delete news.');
    }
  };

  return (
    <div>
      {newsItems.map((news) => (
        <div key={news._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{news.headline}</h2>
          <p>{news.content}</p>
          <p className="text-sm text-gray-500">Publish Date: {new Date(news.publishDate).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingNews(news)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(news._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;