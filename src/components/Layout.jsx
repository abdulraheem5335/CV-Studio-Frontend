import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { ThemeSwitcher, useTheme, CoinIcon } from './ui';
import { 
  FiMap, FiGrid, FiUser, FiLogOut, FiMenu, FiX, 
  FiBell, FiChevronDown, FiSettings, FiHelpCircle
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const { theme, currentMode } = useTheme();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isGameMode = location.pathname === '/game';

  // Track scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [location]);

  const navItems = [
    { path: '/game', icon: FiMap, label: 'Explore', description: 'Interactive campus map' },
    { path: '/portal', icon: FiGrid, label: 'Community', description: 'Feed, events & clubs' },
    { path: '/profile', icon: FiUser, label: 'Profile', description: 'Your achievements' },
  ];

  // Calculate XP progress
  const xpForNextLevel = (user?.level || 1) * 1000;
  const currentXp = user?.xp || 0;
  const xpProgress = (currentXp % 1000) / 10;

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        background: theme.colorPalette.background,
        color: theme.colorPalette.text.primary,
        fontFamily: theme.typography.fontFamily.body,
      }}
    >
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || showMobileMenu ? 'py-2' : 'py-3'
        }`}
        style={{ 
          background: scrolled || showMobileMenu 
            ? theme.colorPalette.surface + 'f5'
            : 'transparent',
          backdropFilter: scrolled || showMobileMenu ? 'blur(20px)' : 'none',
          borderBottom: scrolled || showMobileMenu 
            ? `1px solid ${theme.colorPalette.primary}15`
            : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <NavLink to="/game" className="flex items-center gap-3 group">
              <div 
                className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`,
                  borderRadius: currentMode === 'pixel-retro' ? 4 : 12,
                  boxShadow: `0 4px 15px ${theme.colorPalette.primary}30`,
                }}
              >
                <HiSparkles className="text-white text-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 
                  className="font-bold text-lg leading-tight"
                  style={{ 
                    fontFamily: theme.typography.fontFamily.heading,
                    color: theme.colorPalette.text.primary,
                  }}
                >
                  NUST Campus
                </h1>
                <p 
                  className="text-xs leading-tight"
                  style={{ color: theme.colorPalette.text.muted }}
                >
                  Virtual Experience
                </p>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div 
                className="flex items-center gap-1 p-1 rounded-2xl"
                style={{ background: theme.colorPalette.surface }}
              >
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className="relative px-5 py-2.5 rounded-xl font-medium transition-all duration-200"
                      style={{
                        color: isActive 
                          ? '#fff' 
                          : theme.colorPalette.text.secondary,
                        background: isActive 
                          ? `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
                          : 'transparent',
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="text-lg" />
                        {item.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* XP & Level Badge - Desktop */}
              <div 
                className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl mr-2"
                style={{ 
                  background: theme.colorPalette.surface,
                  border: `1px solid ${theme.colorPalette.primary}15`,
                }}
              >
                {/* Level */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colorPalette.xp}, ${theme.colorPalette.primary})`,
                      color: '#fff',
                    }}
                  >
                    {user?.level || 1}
                  </div>
                  <div className="text-xs">
                    <p style={{ color: theme.colorPalette.text.muted }}>Level</p>
                    <p className="font-semibold" style={{ color: theme.colorPalette.text.primary }}>
                      {currentXp.toLocaleString()} XP
                    </p>
                  </div>
                </div>
                
                {/* XP Progress Bar */}
                <div className="w-20">
                  <div 
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: theme.colorPalette.primary + '20' }}
                  >
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ background: theme.colorPalette.xp }}
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Points */}
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{ background: theme.colorPalette.coins + '15' }}
                >
                  <CoinIcon size={16} color={theme.colorPalette.coins} />
                  <span 
                    className="font-bold text-sm"
                    style={{ color: theme.colorPalette.coins }}
                  >
                    {(user?.points || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Theme Switcher */}
              <ThemeSwitcher compact />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl transition-all hover:opacity-80"
                  style={{ background: theme.colorPalette.surface }}
                >
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ 
                      background: user?.avatar?.color || theme.colorPalette.primary,
                    }}
                  >
                    {user?.nickname?.[0]?.toUpperCase() || '?'}
                  </div>
                  <FiChevronDown 
                    className={`hidden sm:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    style={{ color: theme.colorPalette.text.muted }}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 py-2 rounded-2xl overflow-hidden"
                      style={{ 
                        background: theme.colorPalette.surface,
                        border: `1px solid ${theme.colorPalette.primary}15`,
                        boxShadow: `0 20px 40px ${theme.colorPalette.primary}15`,
                      }}
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b" style={{ borderColor: theme.colorPalette.primary + '10' }}>
                        <p className="font-semibold" style={{ color: theme.colorPalette.text.primary }}>
                          {user?.nickname || 'Student'}
                        </p>
                        <p className="text-sm" style={{ color: theme.colorPalette.text.muted }}>
                          {user?.email || 'student@nust.edu.pk'}
                        </p>
                        
                        {/* Mobile XP Display */}
                        <div className="lg:hidden mt-3 flex items-center gap-2">
                          <div 
                            className="px-2 py-1 rounded-md text-xs font-bold"
                            style={{ 
                              background: theme.colorPalette.xp + '20',
                              color: theme.colorPalette.xp,
                            }}
                          >
                            Lvl {user?.level || 1}
                          </div>
                          <div 
                            className="px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"
                            style={{ 
                              background: theme.colorPalette.coins + '20',
                              color: theme.colorPalette.coins,
                            }}
                          >
                            <CoinIcon size={12} color={theme.colorPalette.coins} /> {user?.points || 0}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <NavLink
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                          style={{ color: theme.colorPalette.text.secondary }}
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FiUser className="text-lg" />
                          <span>View Profile</span>
                        </NavLink>
                        <button
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left transition-colors"
                          style={{ color: theme.colorPalette.text.secondary }}
                        >
                          <FiSettings className="text-lg" />
                          <span>Settings</span>
                        </button>
                        <button
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left transition-colors"
                          style={{ color: theme.colorPalette.text.secondary }}
                        >
                          <FiHelpCircle className="text-lg" />
                          <span>Help & Support</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="pt-1 border-t" style={{ borderColor: theme.colorPalette.primary + '10' }}>
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-left transition-colors"
                          style={{ color: theme.colorPalette.error }}
                        >
                          <FiLogOut className="text-lg" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2.5 rounded-xl transition-colors"
                style={{ 
                  background: theme.colorPalette.surface,
                  color: theme.colorPalette.text.primary,
                }}
              >
                {showMobileMenu ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all"
                      style={{
                        background: isActive 
                          ? `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
                          : theme.colorPalette.surface,
                        color: isActive ? '#fff' : theme.colorPalette.text.primary,
                      }}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <item.icon className="text-xl" />
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p 
                          className="text-xs"
                          style={{ 
                            color: isActive ? 'rgba(255,255,255,0.8)' : theme.colorPalette.text.muted 
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Click outside to close menus */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}

      {/* Main Content */}
      <main className={`${isGameMode ? 'pt-0' : 'pt-20 pb-8'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
