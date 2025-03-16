import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const EventList = ({ events, setEvents, setEditingEvent }) => {
  const { user } = useAuth();

  const handleDelete = async (eventId) => {
    try {
      await axiosInstance.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(events.filter((event) => event._id !== eventId));
    } catch (error) {
      alert('Failed to delete event.');
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const response = await axiosInstance.post(`/api/events/register/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents([...events, response.data]);
      alert('Successfully registered for the event!');
    } catch (error) {
      alert('Failed to register for the event.');
    }
  };

  return (
    <div>
      {events.map((event) => (
        <div key={event._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{event.name}</h2>
          <p>{event.description}</p>
          <p className="text-sm text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">Created by: {event.creator.name}</p>
          {event.isEditable && (
            <div className="mt-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => setEditingEvent(event)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDelete(event._id)}
              >
                Delete
              </button>
            </div>
          )}
          {!event.isEditable && (
            <div className="mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => handleRegister(event._id)}
            >
              Register
            </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
