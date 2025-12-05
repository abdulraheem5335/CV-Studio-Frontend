import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import designModesConfig from '../config/designModes.json';

const { modes, modeTransitions, unlockSystem } = designModesConfig.designModes;

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current active mode
      currentMode: 'nust-classic',
      
      // All available modes
      availableModes: modes,
      
      // User's unlocked modes - all unlocked for testing
      unlockedModes: ['nust-classic', 'cyberpunk-neon', 'cozy-campus', 'pixel-retro'],
      
      // Transition state
      isTransitioning: false,
      transitionProgress: 0,
      
      // Get current theme configuration
      getCurrentTheme: () => {
        const { currentMode, availableModes } = get();
        return availableModes[currentMode] || availableModes['nust-classic'];
      },
      
      // Check if a mode is unlocked
      isModeUnlocked: (modeId) => {
        const { unlockedModes } = get();
        return unlockedModes.includes(modeId);
      },
      
      // Unlock a new mode
      unlockMode: (modeId) => {
        const { unlockedModes } = get();
        if (!unlockedModes.includes(modeId)) {
          set({ unlockedModes: [...unlockedModes, modeId] });
          return true;
        }
        return false;
      },
      
      // Check unlock requirements based on user stats
      checkUnlockRequirements: (userStats) => {
        const { availableModes, unlockMode } = get();
        const newlyUnlocked = [];
        
        Object.entries(availableModes).forEach(([modeId, mode]) => {
          if (mode.unlockRequirement) {
            const { type, value } = mode.unlockRequirement;
            let meetsRequirement = false;
            
            switch (type) {
              case 'level':
                meetsRequirement = userStats.level >= value;
                break;
              case 'quests':
                meetsRequirement = userStats.questsCompleted >= value;
                break;
              case 'miniGames':
                meetsRequirement = userStats.miniGamesPlayed >= value;
                break;
              case 'xp':
                meetsRequirement = userStats.totalXp >= value;
                break;
              default:
                break;
            }
            
            if (meetsRequirement && unlockMode(modeId)) {
              newlyUnlocked.push(mode);
            }
          }
        });
        
        return newlyUnlocked;
      },
      
      // Switch to a different mode with transition
      switchMode: async (newModeId) => {
        const { currentMode, isModeUnlocked, availableModes } = get();
        
        // Check if mode exists and is unlocked
        if (!availableModes[newModeId]) {
          console.error(`Mode "${newModeId}" does not exist`);
          return false;
        }
        
        if (!isModeUnlocked(newModeId)) {
          console.warn(`Mode "${newModeId}" is not unlocked yet`);
          return false;
        }
        
        if (currentMode === newModeId) {
          return true;
        }
        
        // Start transition
        set({ isTransitioning: true, transitionProgress: 0 });
        
        // Animate transition
        const duration = modeTransitions.duration;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          set({ transitionProgress: progress });
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            set({ 
              currentMode: newModeId, 
              isTransitioning: false, 
              transitionProgress: 0 
            });
          }
        };
        
        requestAnimationFrame(animate);
        return true;
      },
      
      // Get transition effect between two modes
      getTransitionEffect: (fromMode, toMode) => {
        const key = `${fromMode}_to_${toMode}`;
        const reverseKey = `${toMode}_to_${fromMode}`;
        return modeTransitions.effects[key] || 
               modeTransitions.effects[reverseKey] || 
               'fade';
      },
      
      // Cycle to next unlocked mode
      cycleMode: () => {
        const { currentMode, unlockedModes, switchMode } = get();
        const currentIndex = unlockedModes.indexOf(currentMode);
        const nextIndex = (currentIndex + 1) % unlockedModes.length;
        switchMode(unlockedModes[nextIndex]);
      },
      
      // Get mode preview (for locked modes)
      getModePreview: (modeId) => {
        const { availableModes } = get();
        const mode = availableModes[modeId];
        if (!mode) return null;
        
        return {
          id: mode.id,
          name: mode.name,
          description: mode.description,
          mood: mode.mood,
          unlockRequirement: mode.unlockRequirement,
          previewColors: {
            primary: mode.colorPalette.primary,
            secondary: mode.colorPalette.secondary,
            accent: mode.colorPalette.accent,
            background: mode.colorPalette.background
          }
        };
      },
      
      // Get all modes with unlock status
      getAllModesWithStatus: () => {
        const { availableModes, unlockedModes } = get();
        return Object.entries(availableModes).map(([id, mode]) => ({
          id,
          name: mode.name,
          description: mode.description,
          mood: mode.mood,
          unlockRequirement: mode.unlockRequirement,
          isUnlocked: unlockedModes.includes(id),
          previewColors: {
            primary: mode.colorPalette.primary,
            secondary: mode.colorPalette.secondary,
            accent: mode.colorPalette.accent
          }
        }));
      }
    }),
    {
      name: 'nust-theme-storage',
      partials: ['currentMode', 'unlockedModes']
    }
  )
);

// CSS Variable generator from theme
export const generateCSSVariables = (theme) => {
  if (!theme) return {};
  
  const { colorPalette, typography, ui } = theme;
  
  return {
    // Colors
    '--color-primary': colorPalette.primary,
    '--color-secondary': colorPalette.secondary,
    '--color-accent': colorPalette.accent,
    '--color-background': colorPalette.background,
    '--color-surface': colorPalette.surface,
    '--color-text-primary': colorPalette.text.primary,
    '--color-text-secondary': colorPalette.text.secondary,
    '--color-text-muted': colorPalette.text.muted,
    '--color-success': colorPalette.success,
    '--color-warning': colorPalette.warning,
    '--color-error': colorPalette.error,
    '--color-xp': colorPalette.xp,
    '--color-coins': colorPalette.coins,
    
    // Typography
    '--font-heading': typography.fontFamily.heading,
    '--font-body': typography.fontFamily.body,
    '--font-mono': typography.fontFamily.mono,
    '--font-size-xs': typography.sizes.xs,
    '--font-size-sm': typography.sizes.sm,
    '--font-size-base': typography.sizes.base,
    '--font-size-lg': typography.sizes.lg,
    '--font-size-xl': typography.sizes.xl,
    '--font-size-2xl': typography.sizes['2xl'],
    '--font-size-3xl': typography.sizes['3xl'],
    
    // UI
    '--panel-background': ui.panels.background,
    '--panel-border': ui.panels.border,
    '--panel-border-radius': ui.panels.borderRadius,
    '--panel-shadow': ui.panels.shadow,
    '--panel-blur': ui.panels.blur,
    '--button-border-radius': ui.buttons.primary.borderRadius
  };
};

// Helper to apply theme to document
export const applyThemeToDocument = (theme) => {
  const variables = generateCSSVariables(theme);
  const root = document.documentElement;
  
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export default useThemeStore;
