import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../components/ui';
import { 
  FiEdit3, FiCalendar, FiUsers, FiAward, FiSearch
} from 'react-icons/fi';
import Feed from '../components/portal/Feed';
import Events from '../components/portal/Events';
import Clubs from '../components/portal/Clubs';
import Leaderboard from '../components/portal/Leaderboard';

const PortalMode = () => {
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'feed', name: 'Feed', icon: FiEdit3 },
    { id: 'events', name: 'Events', icon: FiCalendar },
    { id: 'clubs', name: 'Clubs', icon: FiUsers },
    { id: 'leaderboard', name: 'Rankings', icon: FiAward }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <Feed />;
      case 'events':
        return <Events />;
      case 'clubs':
        return <Clubs />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <Feed />;
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ background: theme.colorPalette.background }}
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ 
              color: theme.colorPalette.text.primary,
              fontFamily: theme.typography.fontFamily.heading,
            }}
          >
            Community Portal
          </h1>
          <p style={{ color: theme.colorPalette.text.muted }}>
            Discover events, join clubs, and connect with your campus community
          </p>
        </div>

        {/* Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Tab Navigation */}
          <div 
            className="flex items-center gap-1 p-1 rounded-xl w-full sm:w-auto"
            style={{ background: theme.colorPalette.surface }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all flex-1 sm:flex-initial justify-center"
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
                      : 'transparent',
                    color: isActive ? '#fff' : theme.colorPalette.text.secondary,
                  }}
                >
                  <tab.icon className="text-lg" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div 
            className="relative w-full sm:w-64"
          >
            <FiSearch 
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: theme.colorPalette.text.muted }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-colors"
              style={{ 
                background: theme.colorPalette.surface,
                color: theme.colorPalette.text.primary,
                border: `1px solid ${theme.colorPalette.primary}15`,
              }}
            />
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortalMode;
