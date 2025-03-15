import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const EventForm = ({ events, setEvents, editingEvent, setEditingEvent }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', description: '', location: '', date: '' });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        id: editingEvent.id,
        name: editingEvent.name,
        description: editingEvent.description,
        location: editingEvent.location,
        date: new Date(editingEvent.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({ name: '', description: '', location: '', date: '' });
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const response = await axiosInstance.put(`/api/events/${editingEvent._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEvents(events.map((event) => (event._id === response.data._id ? response.data : event)));
      } else {
        const response = await axiosInstance.post('/api/events', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEvents([...events, response.data]);
      }
      setEditingEvent(null);
      setFormData({ name: '', description: '', location: '', date: '' });
    } catch (error) {
      alert('Failed to save task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Create Event'}</h1>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingEvent ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventForm;
