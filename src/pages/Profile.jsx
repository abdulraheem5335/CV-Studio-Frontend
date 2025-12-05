import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
  useTheme,
  IntrovertIcon, ExtrovertIcon, BookwormIcon, 
  AdventurerIcon, GamerIcon, ExplorerIcon,
  FirstStepsIcon, SocialButterflyIcon, EarlyBirdIcon, QuizMasterIcon,
  CheckIcon
} from '../components/ui';
import { 
  FiUser, FiEdit2, FiSave, FiAward, FiMapPin, 
  FiCalendar, FiTrendingUp, FiShield, FiCheckCircle, FiX
} from 'react-icons/fi';
import { GiTrophy, GiBackpack, GiScrollQuill } from 'react-icons/gi';
import toast from 'react-hot-toast';
import NustIdVerification from '../components/auth/NustIdVerification';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [editData, setEditData] = useState({
    nickname: user?.nickname || '',
    userType: user?.userType || 'explorer',
  });
  const [activeTab, setActiveTab] = useState('overview');

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
    toast.success('Profile updated!');
  };

  const userTypes = [
    { id: 'introvert', label: 'Introvert', Icon: IntrovertIcon },
    { id: 'extrovert', label: 'Extrovert', Icon: ExtrovertIcon },
    { id: 'bookworm', label: 'Bookworm', Icon: BookwormIcon },
    { id: 'adventurer', label: 'Adventurer', Icon: AdventurerIcon },
    { id: 'gamer', label: 'Gamer', Icon: GamerIcon },
    { id: 'explorer', label: 'Explorer', Icon: ExplorerIcon },
  ];

  const badges = [
    { id: 1, name: 'First Steps', Icon: FirstStepsIcon, description: 'Complete your first quest', earned: true },
    { id: 2, name: 'Bookworm', Icon: IntrovertIcon, description: 'Visit the library 10 times', earned: true },
    { id: 3, name: 'Social Butterfly', Icon: SocialButterflyIcon, description: 'Join 3 clubs', earned: false },
    { id: 4, name: 'Early Bird', Icon: EarlyBirdIcon, description: 'Login for 7 consecutive days', earned: false },
    { id: 5, name: 'Explorer', Icon: AdventurerIcon, description: 'Visit all campus zones', earned: false },
    { id: 6, name: 'Quiz Master', Icon: QuizMasterIcon, description: 'Win 5 quiz games', earned: true },
  ];

  const stats = [
    { label: 'Zones Visited', value: 8, icon: FiMapPin },
    { label: 'Quests Done', value: 12, icon: GiScrollQuill },
    { label: 'Posts Created', value: 24, icon: FiEdit2 },
    { label: 'Events', value: 5, icon: FiCalendar },
  ];

  const currentLevel = user?.level || 1;
  const xpForNextLevel = currentLevel * 1000;
  const currentXp = user?.xp || 0;
  const xpProgress = (currentXp % 1000) / 10;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'badges', label: 'Badges', icon: FiAward },
    { id: 'inventory', label: 'Inventory', icon: GiBackpack },
    { id: 'stats', label: 'Statistics', icon: FiTrendingUp },
  ];

  return (
    <div 
      className="min-h-screen py-6"
      style={{ background: theme.colorPalette.background }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-6"
          style={{ 
            background: theme.colorPalette.surface,
            border: `1px solid ${theme.colorPalette.primary}10`,
          }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div
                className="w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg"
                style={{ 
                  backgroundColor: user?.avatar?.color || theme.colorPalette.primary,
                  boxShadow: `0 8px 32px ${user?.avatar?.color || theme.colorPalette.primary}30`
                }}
              >
                {user?.nickname?.[0]?.toUpperCase() || '?'}
              </div>
              
              <div className="mt-4 flex flex-col items-center gap-2">
                <div 
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{ 
                    background: `${theme.colorPalette.xp}20`,
                    color: theme.colorPalette.xp,
                  }}
                >
                  Level {currentLevel}
                </div>
                
                {user?.isVerified ? (
                  <div 
                    className="flex items-center gap-1.5 text-sm"
                    style={{ color: theme.colorPalette.success }}
                  >
                    <FiCheckCircle />
                    <span>Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowVerification(true)}
                    className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
                    style={{ color: theme.colorPalette.coins }}
                  >
                    <FiShield />
                    <span>Verify ID</span>
                  </button>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm mb-2"
                      style={{ color: theme.colorPalette.text.muted }}
                    >
                      Nickname
                    </label>
                    <input
                      type="text"
                      value={editData.nickname}
                      onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-colors"
                      style={{ 
                        background: theme.colorPalette.background,
                        color: theme.colorPalette.text.primary,
                        border: `1px solid ${theme.colorPalette.primary}20`,
                      }}
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm mb-2"
                      style={{ color: theme.colorPalette.text.muted }}
                    >
                      User Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {userTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setEditData({ ...editData, userType: type.id })}
                          className="px-3 py-2 rounded-lg transition-all flex items-center gap-2"
                          style={{
                            background: editData.userType === type.id 
                              ? `${theme.colorPalette.primary}20`
                              : theme.colorPalette.background,
                            color: editData.userType === type.id 
                              ? theme.colorPalette.primary
                              : theme.colorPalette.text.secondary,
                            border: `1px solid ${editData.userType === type.id ? theme.colorPalette.primary : theme.colorPalette.primary + '15'}`,
                          }}
                        >
                          <type.Icon size={18} color={editData.userType === type.id ? theme.colorPalette.primary : theme.colorPalette.text.secondary} />
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleSave}
                      className="px-5 py-2.5 rounded-xl font-medium flex items-center gap-2"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`,
                        color: '#fff',
                      }}
                    >
                      <FiSave /> Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 rounded-xl font-medium flex items-center gap-2"
                      style={{ 
                        background: theme.colorPalette.background,
                        color: theme.colorPalette.text.secondary,
                      }}
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 
                        className="text-2xl md:text-3xl font-bold mb-1"
                        style={{ 
                          color: theme.colorPalette.text.primary,
                          fontFamily: theme.typography.fontFamily.heading,
                        }}
                      >
                        {user?.nickname || 'Anonymous'}
                      </h1>
                      <p 
                        className="flex items-center gap-2 capitalize"
                        style={{ color: theme.colorPalette.text.muted }}
                      >
                        {(() => {
                          const UserTypeIcon = userTypes.find(t => t.id === user?.userType)?.Icon;
                          return UserTypeIcon ? <UserTypeIcon size={18} color={theme.colorPalette.text.muted} /> : null;
                        })()}
                        {user?.userType || 'Explorer'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2.5 rounded-xl transition-colors"
                      style={{ 
                        background: theme.colorPalette.background,
                        color: theme.colorPalette.text.secondary,
                      }}
                    >
                      <FiEdit2 />
                    </button>
                  </div>

                  {/* XP Progress */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: theme.colorPalette.text.muted }}>XP Progress</span>
                      <span style={{ color: theme.colorPalette.xp }}>
                        {currentXp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
                      </span>
                    </div>
                    <div 
                      className="h-2.5 rounded-full overflow-hidden"
                      style={{ background: theme.colorPalette.primary + '20' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${theme.colorPalette.xp}, ${theme.colorPalette.primary})` }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <div 
                      className="text-center p-3 rounded-xl"
                      style={{ background: theme.colorPalette.background }}
                    >
                      <p 
                        className="text-xl font-bold"
                        style={{ color: theme.colorPalette.coins }}
                      >
                        {(user?.points || 0).toLocaleString()}
                      </p>
                      <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>Points</p>
                    </div>
                    <div 
                      className="text-center p-3 rounded-xl"
                      style={{ background: theme.colorPalette.background }}
                    >
                      <p 
                        className="text-xl font-bold"
                        style={{ color: theme.colorPalette.xp }}
                      >
                        {(user?.xp || 0).toLocaleString()}
                      </p>
                      <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>Total XP</p>
                    </div>
                    <div 
                      className="text-center p-3 rounded-xl"
                      style={{ background: theme.colorPalette.background }}
                    >
                      <p 
                        className="text-xl font-bold"
                        style={{ color: theme.colorPalette.success }}
                      >
                        {user?.loginStreak || 0}
                      </p>
                      <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>Day Streak</p>
                    </div>
                    <div 
                      className="text-center p-3 rounded-xl"
                      style={{ background: theme.colorPalette.background }}
                    >
                      <p 
                        className="text-xl font-bold"
                        style={{ color: theme.colorPalette.primary }}
                      >
                        {badges.filter(b => b.earned).length}
                      </p>
                      <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>Badges</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div 
          className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
          style={{ background: theme.colorPalette.surface }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.id 
                  ? `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
                  : 'transparent',
                color: activeTab === tab.id ? '#fff' : theme.colorPalette.text.secondary,
              }}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Activity Stats */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  background: theme.colorPalette.surface,
                  border: `1px solid ${theme.colorPalette.primary}10`,
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.colorPalette.text.primary }}
                >
                  <FiTrendingUp style={{ color: theme.colorPalette.primary }} />
                  Activity Overview
                </h3>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <stat.icon style={{ color: theme.colorPalette.primary }} />
                        <span style={{ color: theme.colorPalette.text.secondary }}>{stat.label}</span>
                      </div>
                      <span 
                        className="font-bold"
                        style={{ color: theme.colorPalette.text.primary }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Badges */}
              <div 
                className="rounded-2xl p-6"
                style={{ 
                  background: theme.colorPalette.surface,
                  border: `1px solid ${theme.colorPalette.primary}10`,
                }}
              >
                <h3 
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: theme.colorPalette.text.primary }}
                >
                  <GiTrophy style={{ color: theme.colorPalette.coins }} />
                  Recent Badges
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {badges.filter(b => b.earned).slice(0, 6).map((badge) => (
                    <div
                      key={badge.id}
                      className="p-3 rounded-xl text-center transition-colors cursor-pointer"
                      style={{ background: theme.colorPalette.background }}
                    >
                      <div className="mb-1 flex justify-center">
                        <badge.Icon size={28} color={theme.colorPalette.primary} />
                      </div>
                      <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>{badge.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl p-6"
              style={{ 
                background: theme.colorPalette.surface,
                border: `1px solid ${theme.colorPalette.primary}10`,
              }}
            >
              <h3 
                className="text-lg font-semibold mb-6"
                style={{ color: theme.colorPalette.text.primary }}
              >
                All Badges
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-xl transition-all"
                    style={{
                      background: badge.earned 
                        ? `${theme.colorPalette.coins}10`
                        : theme.colorPalette.background,
                      border: `1px solid ${badge.earned ? theme.colorPalette.coins + '30' : theme.colorPalette.primary + '10'}`,
                      opacity: badge.earned ? 1 : 0.6,
                    }}
                  >
                    <div className="mb-2">
                      <badge.Icon size={32} color={badge.earned ? theme.colorPalette.coins : theme.colorPalette.text.muted} />
                    </div>
                    <h4 
                      className="font-semibold"
                      style={{ color: theme.colorPalette.text.primary }}
                    >
                      {badge.name}
                    </h4>
                    <p 
                      className="text-xs mt-1"
                      style={{ color: theme.colorPalette.text.muted }}
                    >
                      {badge.description}
                    </p>
                    {badge.earned && (
                      <div 
                        className="mt-2 text-xs font-medium flex items-center gap-1"
                        style={{ color: theme.colorPalette.coins }}
                      >
                        <CheckIcon size={14} color={theme.colorPalette.coins} /> Earned
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl p-6"
              style={{ 
                background: theme.colorPalette.surface,
                border: `1px solid ${theme.colorPalette.primary}10`,
              }}
            >
              <h3 
                className="text-lg font-semibold mb-6"
                style={{ color: theme.colorPalette.text.primary }}
              >
                Your Inventory
              </h3>
              <div className="text-center py-12">
                <GiBackpack 
                  className="text-5xl mx-auto mb-4 opacity-30"
                  style={{ color: theme.colorPalette.text.muted }}
                />
                <p style={{ color: theme.colorPalette.text.muted }}>Your inventory is empty</p>
                <p 
                  className="text-sm mt-2"
                  style={{ color: theme.colorPalette.text.muted }}
                >
                  Complete quests and explore to earn items!
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl p-6"
              style={{ 
                background: theme.colorPalette.surface,
                border: `1px solid ${theme.colorPalette.primary}10`,
              }}
            >
              <h3 
                className="text-lg font-semibold mb-6"
                style={{ color: theme.colorPalette.text.primary }}
              >
                Detailed Statistics
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 
                    className="mb-3"
                    style={{ color: theme.colorPalette.text.muted }}
                  >
                    Exploration
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Total Zones Visited', value: '8 / 10' },
                      { label: 'Secrets Found', value: '3' },
                      { label: 'Distance Traveled', value: '2.5 km' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span style={{ color: theme.colorPalette.text.secondary }}>{item.label}</span>
                        <span 
                          className="font-medium"
                          style={{ color: theme.colorPalette.text.primary }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 
                    className="mb-3"
                    style={{ color: theme.colorPalette.text.muted }}
                  >
                    Social
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Total Posts', value: '24' },
                      { label: 'Reactions Received', value: '156' },
                      { label: 'Clubs Joined', value: '2' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span style={{ color: theme.colorPalette.text.secondary }}>{item.label}</span>
                        <span 
                          className="font-medium"
                          style={{ color: theme.colorPalette.text.primary }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NUST ID Verification Modal */}
      <AnimatePresence>
        {showVerification && (
          <NustIdVerification
            onVerified={(data) => {
              updateUser({ isVerified: true, verificationData: data });
              toast.success('ID verified successfully! +500 XP');
            }}
            onClose={() => setShowVerification(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
