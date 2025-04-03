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
      setEvents(events.map((event) => (event._id === response.data._id ? response.data : event)));
    } catch (error) {
      alert('Failed to register for the event.');
    }
  };

  const handleUnRegister = async (eventId) => {
    try {
      const response = await axiosInstance.post(`/api/events/unregister/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(events.map((event) => (event._id === response.data._id ? response.data : event)));
    } catch (error) {
      alert('Failed to unregister from the event.');
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
          {event.participants && event.participants.length > 0 ? (
            <div className="mt-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={(e) => {
                  e.currentTarget.nextElementSibling.classList.toggle('hidden');
                }}
              >
                Show Participants
              </button>
              <div className="hidden mt-2 ml-4">
                {event.participants.map((participant) => (
                  <div key={participant._id} className="text-sm text-gray-600">
                    {participant.name}
                  </div>
                ))}
              </div>
            </div>
          ) 
          : (<div className="mt-2">
              <p className="text-orange-500"><strong>No registrations yet</strong></p>
            </div>)}
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
          {!event.isEditable && !event.isRegistered && (
            <div className="mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => handleRegister(event._id)}
            >
              Register
            </button>
            </div>
          )}
          {!event.isEditable && event.isRegistered && (
            <div className="mt-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleUnRegister(event._id)}
              >
                Unregister
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
