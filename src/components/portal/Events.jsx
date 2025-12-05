import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { 
  useTheme,
  CompetitionIcon, ExtrovertIcon, SportsIcon, CulturalIcon, 
  WorkshopIcon, SeminarIcon, CalendarIcon, LocationIcon, 
  UsersIcon, SpinnerIcon, StarIcon, CoinIcon, CloseIcon
} from '../ui';

const Events = () => {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events', { params: { status: filter } });
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/join`);
      fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error joining event:', error);
      alert(error.response?.data?.message || 'Failed to join event');
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/leave`);
      fetchEvents();
    } catch (error) {
      console.error('Error leaving event:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeIcon = (type, size = 24) => {
    const icons = {
      competition: CompetitionIcon,
      social: ExtrovertIcon,
      sports: SportsIcon,
      cultural: CulturalIcon,
      workshop: WorkshopIcon,
      seminar: SeminarIcon
    };
    const IconComponent = icons[type] || CalendarIcon;
    return <IconComponent size={size} color="#fff" />;
  };

  const getEventTypeColor = (type) => {
    const colors = {
      competition: 'from-yellow-500 to-orange-500',
      social: 'from-pink-500 to-purple-500',
      sports: 'from-green-500 to-emerald-500',
      cultural: 'from-purple-500 to-indigo-500',
      workshop: 'from-blue-500 to-cyan-500',
      seminar: 'from-indigo-500 to-purple-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: theme.colorPalette.text.primary }}>Campus Events</h1>
        <div className="flex gap-2">
          {['upcoming', 'ongoing', 'past'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg transition"
              style={{
                background: filter === f 
                  ? `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
                  : theme.colorPalette.surface,
                color: filter === f ? '#fff' : theme.colorPalette.text.secondary,
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <SpinnerIcon size={40} color={theme.colorPalette.primary} />
          <p className="text-gray-400 mt-2">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl">
          <CalendarIcon size={40} color="#9ca3af" className="mx-auto mb-2" />
          <p className="text-gray-400">No {filter} events found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => (
            <motion.div
              key={event.id || event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEvent(event)}
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Event Banner */}
              <div className={`h-24 bg-gradient-to-r ${getEventTypeColor(event.type)} flex items-center justify-center`}>
                {getEventTypeIcon(event.type, 48)}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <span className="px-2 py-1 bg-purple-600/30 text-purple-400 rounded text-xs">
                    {event.type}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CalendarIcon size={16} color="#9ca3af" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <LocationIcon size={16} color="#9ca3af" />
                    <span>{event.location?.venue || event.location?.zoneName || 'TBA'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                      <UsersIcon size={16} color="#9ca3af" />
                      <span>{(event.participants || []).length}/{event.maxParticipants || '∞'}</span>
                    </div>
                    {event.rewards && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 text-xs">+{event.rewards.xp} XP</span>
                        <span className="text-yellow-400 text-xs">+{event.rewards.points} pts</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Banner */}
              <div className={`h-32 bg-gradient-to-r ${getEventTypeColor(selectedEvent.type)} flex items-center justify-center relative`}>
                {getEventTypeIcon(selectedEvent.type, 64)}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50"
                >
                  <CloseIcon size={18} color="#fff" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                <p className="text-gray-400 mb-4">{selectedEvent.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <CalendarIcon size={24} color="#d1d5db" />
                    <div>
                      <div className="font-medium">Date & Time</div>
                      <div className="text-sm text-gray-400">{formatDate(selectedEvent.startDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <LocationIcon size={24} color="#d1d5db" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-gray-400">
                        {selectedEvent.location?.venue || selectedEvent.location?.zoneName || 'To be announced'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <UsersIcon size={24} color="#d1d5db" />
                    <div>
                      <div className="font-medium">Participants</div>
                      <div className="text-sm text-gray-400">
                        {(selectedEvent.participants || []).length} / {selectedEvent.maxParticipants || '∞'} registered
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEvent.rewards && (
                  <div className="bg-gray-800 rounded-xl p-4 mb-6">
                    <div className="text-gray-400 text-sm mb-2">Rewards for attending:</div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <StarIcon size={20} color="#4ade80" />
                        <span className="text-green-400 font-bold">+{selectedEvent.rewards.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CoinIcon size={20} color="#facc15" />
                        <span className="text-yellow-400 font-bold">+{selectedEvent.rewards.points} Points</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleJoinEvent(selectedEvent.id || selectedEvent._id)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-white transition"
                >
                  Register for Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
