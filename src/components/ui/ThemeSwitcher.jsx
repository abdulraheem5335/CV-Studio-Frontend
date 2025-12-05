import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, applyThemeToDocument } from '../../store/themeStore';
import { 
  ProfessionalIcon, FuturisticIcon, RelaxingIcon, NostalgicIcon,
  LockIcon, CheckIcon
} from './icons';

const ThemeSwitcher = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUnlockPopup, setShowUnlockPopup] = useState(null);
  
  const {
    currentMode,
    getCurrentTheme,
    getAllModesWithStatus,
    switchMode,
    isTransitioning,
    transitionProgress,
    getTransitionEffect
  } = useThemeStore();

  const theme = getCurrentTheme();
  const allModes = getAllModesWithStatus();

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [currentMode, theme]);

  // Keyboard shortcut to toggle modes (Shift + M)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'm' || e.key === 'M') {
        if (e.shiftKey) {
          e.preventDefault();
          setIsOpen(prev => !prev);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleModeSelect = async (modeId, isUnlocked) => {
    if (!isUnlocked) {
      setShowUnlockPopup(modeId);
      setTimeout(() => setShowUnlockPopup(null), 3000);
      return;
    }
    
    await switchMode(modeId);
    setIsOpen(false);
  };

  const getMoodIcon = (mood, size = 24) => {
    const icons = {
      professional: ProfessionalIcon,
      futuristic: FuturisticIcon,
      relaxing: RelaxingIcon,
      nostalgic: NostalgicIcon
    };
    const IconComponent = icons[mood] || ProfessionalIcon;
    return <IconComponent size={size} />;
  };

  const getUnlockText = (requirement) => {
    if (!requirement) return 'Default Theme';
    
    const { type, value } = requirement;
    switch (type) {
      case 'level':
        return `Reach Level ${value}`;
      case 'quests':
        return `Complete ${value} Quests`;
      case 'miniGames':
        return `Play ${value} Mini-Games`;
      case 'xp':
        return `Earn ${value.toLocaleString()} XP`;
      default:
        return 'Special Unlock';
    }
  };

  // Compact toggle button
  if (compact) {
    return (
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg transition-all"
          style={{
            background: theme.colorPalette.surface,
            border: `2px solid ${theme.colorPalette.primary}`,
            color: theme.colorPalette.text.primary
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {getMoodIcon(theme.mood, 20)}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="absolute right-0 mt-2 w-64 z-50 rounded-xl overflow-hidden"
              style={{
                background: theme.ui.panels.background,
                border: theme.ui.panels.border,
                boxShadow: theme.ui.panels.shadow
              }}
            >
              <div className="p-3 border-b" style={{ borderColor: theme.colorPalette.primary + '30' }}>
                <h3 className="font-bold" style={{ 
                  fontFamily: theme.typography.fontFamily.heading,
                  color: theme.colorPalette.text.primary 
                }}>
                  Design Modes
                </h3>
                <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>
                  Press Shift+M to toggle
                </p>
              </div>
              
              <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                {allModes.map((mode) => (
                  <motion.button
                    key={mode.id}
                    onClick={() => handleModeSelect(mode.id, mode.isUnlocked)}
                    className="w-full p-3 rounded-lg text-left relative hover:brightness-110"
                    style={{
                      background: currentMode === mode.id 
                        ? mode.previewColors.primary + '20'
                        : `${mode.previewColors.primary}08`,
                      border: currentMode === mode.id 
                        ? `2px solid ${mode.previewColors.primary}`
                        : '2px solid transparent',
                      opacity: mode.isUnlocked ? 1 : 0.6,
                      transition: 'all 0.2s ease'
                    }}
                    whileHover={{ 
                      scale: 1.02 
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {getMoodIcon(mode.mood, 24)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate" style={{ 
                            color: theme.colorPalette.text.primary 
                          }}>
                            {mode.name}
                          </span>
                          {!mode.isUnlocked && (
                            <LockIcon size={14} color={theme.colorPalette.text.muted} />
                          )}
                          {currentMode === mode.id && (
                            <CheckIcon size={14} color="#22c55e" />
                          )}
                        </div>
                        <p className="text-xs truncate" style={{ 
                          color: theme.colorPalette.text.muted 
                        }}>
                          {mode.isUnlocked ? mode.description : getUnlockText(mode.unlockRequirement)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Color preview */}
                    <div className="flex gap-1 mt-2">
                      {Object.values(mode.previewColors).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unlock popup */}
        <AnimatePresence>
          {showUnlockPopup && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-64 p-4 rounded-xl z-50"
              style={{
                background: theme.colorPalette.error + '20',
                border: `2px solid ${theme.colorPalette.error}`,
                color: theme.colorPalette.text.primary
              }}
            >
              <p className="font-medium flex items-center gap-2">
                <LockIcon size={18} color={theme.colorPalette.error} /> Mode Locked
              </p>
              <p className="text-sm mt-1" style={{ color: theme.colorPalette.text.secondary }}>
                {getUnlockText(allModes.find(m => m.id === showUnlockPopup)?.unlockRequirement)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full theme switcher panel
  return (
    <div className="relative">
      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
            style={{
              background: `linear-gradient(45deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
            }}
          >
            <motion.div
              className="text-white text-2xl font-bold"
              style={{ fontFamily: theme.typography.fontFamily.heading }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            >
              Switching Theme...
            </motion.div>
            <div className="absolute bottom-10 w-64 h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                style={{ width: `${transitionProgress * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allModes.map((mode) => (
          <motion.div
            key={mode.id}
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            style={{
              border: currentMode === mode.id 
                ? `3px solid ${mode.previewColors.primary}`
                : '3px solid transparent',
              opacity: mode.isUnlocked ? 1 : 0.7
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeSelect(mode.id, mode.isUnlocked)}
          >
            {/* Preview gradient background */}
            <div 
              className="h-32 p-4 relative"
              style={{
                background: `linear-gradient(135deg, ${mode.previewColors.primary} 0%, ${mode.previewColors.secondary} 50%, ${mode.previewColors.accent} 100%)`
              }}
            >
              {/* Mode icon */}
              <div className="absolute top-4 right-4">
                {getMoodIcon(mode.mood, 36)}
              </div>
              
              {/* Lock overlay */}
              {!mode.isUnlocked && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <LockIcon size={32} color="#fff" />
                    <p className="text-sm mt-2">{getUnlockText(mode.unlockRequirement)}</p>
                  </div>
                </div>
              )}
              
              {/* Active badge */}
              {currentMode === mode.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4 bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"
                >
                  <CheckIcon size={14} color="#16a34a" /> Active
                </motion.div>
              )}
            </div>

            {/* Mode info */}
            <div 
              className="p-4"
              style={{ background: theme.colorPalette.surface }}
            >
              <h3 className="font-bold text-lg" style={{ 
                fontFamily: theme.typography.fontFamily.heading,
                color: theme.colorPalette.text.primary 
              }}>
                {mode.name}
              </h3>
              <p className="text-sm mt-1" style={{ color: theme.colorPalette.text.secondary }}>
                {mode.description}
              </p>
              
              {/* Color swatches */}
              <div className="flex gap-2 mt-3">
                {Object.entries(mode.previewColors).map(([name, color]) => (
                  <div
                    key={name}
                    className="w-6 h-6 rounded-full ring-2 ring-white shadow"
                    style={{ background: color }}
                    title={name}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
