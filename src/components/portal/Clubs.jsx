import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { 
  useTheme,
  AcademicIcon, CulturalIcon, SportsIcon, TechIcon, SocialIcon,
  ClubIcon, UsersIcon, UserIcon, SpinnerIcon, CloseIcon
} from '../ui';

const Clubs = () => {
  const { theme } = useTheme();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchClubs();
  }, [filter]);

  const fetchClubs = async () => {
    try {
      const params = filter !== 'all' ? { category: filter } : {};
      const response = await api.get('/clubs', { params });
      setClubs(response.data.clubs || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      await api.post(`/clubs/${clubId}/join`);
      fetchClubs();
      alert('Successfully joined the club!');
    } catch (error) {
      console.error('Error joining club:', error);
      alert(error.response?.data?.message || 'Failed to join club');
    }
  };

  const categories = ['all', 'academic', 'cultural', 'sports', 'tech', 'social'];

  const getCategoryIcon = (category, size = 24) => {
    const icons = {
      academic: AcademicIcon,
      cultural: CulturalIcon,
      sports: SportsIcon,
      tech: TechIcon,
      social: SocialIcon
    };
    const IconComponent = icons[category] || ClubIcon;
    return <IconComponent size={size} color="#fff" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'from-blue-500 to-indigo-500',
      cultural: 'from-purple-500 to-pink-500',
      sports: 'from-green-500 to-emerald-500',
      tech: 'from-cyan-500 to-blue-500',
      social: 'from-orange-500 to-red-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Campus Clubs</h1>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition flex items-center gap-2 ${
              filter === cat
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat !== 'all' && getCategoryIcon(cat, 18)}
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <SpinnerIcon size={40} color={theme.colorPalette.primary} />
          <p className="text-gray-400 mt-2">Loading clubs...</p>
        </div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl">
          <ClubIcon size={40} color="#9ca3af" className="mx-auto mb-2" />
          <p className="text-gray-400">No clubs found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => (
            <motion.div
              key={club.id || club._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedClub(club)}
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Club Banner */}
              <div className={`h-20 bg-gradient-to-r ${getCategoryColor(club.category)} flex items-center justify-center`}>
                {club.logo ? <span className="text-4xl">{club.logo}</span> : getCategoryIcon(club.category, 40)}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{club.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{club.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <UsersIcon size={16} color="#9ca3af" />
                    <span>{(club.members || []).length} members</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    club.membershipType === 'open' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {club.membershipType === 'open' ? 'Open' : 'By Invite'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Club Detail Modal */}
      <AnimatePresence>
        {selectedClub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedClub(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Banner */}
              <div className={`h-32 bg-gradient-to-r ${getCategoryColor(selectedClub.category)} flex items-center justify-center relative`}>
                {selectedClub.logo ? <span className="text-6xl">{selectedClub.logo}</span> : getCategoryIcon(selectedClub.category, 64)}
                <button
                  onClick={() => setSelectedClub(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50"
                >
                  <CloseIcon size={18} color="#fff" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-2xl font-bold text-white">{selectedClub.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedClub.membershipType === 'open'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedClub.membershipType === 'open' ? 'Open Membership' : 'By Invitation'}
                  </span>
                </div>

                <p className="text-gray-400 mb-6">{selectedClub.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400">
                      {(selectedClub.members || []).length}
                    </div>
                    <div className="text-gray-400 text-sm">Members</div>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {selectedClub.eventsCount || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Events Hosted</div>
                  </div>
                </div>

                {selectedClub.president && (
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <UserIcon size={20} color="#fff" />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">President</div>
                      <div className="text-white font-medium">{selectedClub.president.nickname}</div>
                    </div>
                  </div>
                )}

                {selectedClub.perks && selectedClub.perks.length > 0 && (
                  <div className="mb-6">
                    <div className="text-gray-400 text-sm mb-2">Member Perks:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedClub.perks.map((perk, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleJoinClub(selectedClub.id || selectedClub._id)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-white transition"
                >
                  {selectedClub.membershipType === 'open' ? 'Join Club' : 'Request to Join'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clubs;
