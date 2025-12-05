import { useEffect, createContext, useContext } from 'react';
import { useThemeStore, applyThemeToDocument } from '../../store/themeStore';

// Create theme context
const ThemeContext = createContext(null);

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const themeStore = useThemeStore();
  const theme = themeStore.getCurrentTheme();

  // Apply CSS variables when theme changes
  useEffect(() => {
    if (theme) {
      applyThemeToDocument(theme);
      
      // Add Google Fonts dynamically
      const fonts = [
        theme.typography.fontFamily.heading,
        theme.typography.fontFamily.body
      ].filter(Boolean);
      
      fonts.forEach(font => {
        const fontName = font.replace(/'/g, '').split(',')[0].trim();
        const existingLink = document.querySelector(`link[data-font="${fontName}"]`);
        
        if (!existingLink && !fontName.includes('sans-serif') && !fontName.includes('monospace')) {
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
          link.rel = 'stylesheet';
          link.setAttribute('data-font', fontName);
          document.head.appendChild(link);
        }
      });
    }
  }, [theme]);

  // Apply theme-specific body styles
  useEffect(() => {
    if (theme) {
      document.body.style.backgroundColor = theme.colorPalette.background;
      document.body.style.color = theme.colorPalette.text.primary;
      document.body.style.fontFamily = theme.typography.fontFamily.body;
      
      // Add theme class for CSS targeting
      document.body.className = `theme-${themeStore.currentMode}`;
    }
    
    return () => {
      document.body.className = '';
    };
  }, [theme, themeStore.currentMode]);

  const contextValue = {
    theme,
    currentMode: themeStore.currentMode,
    switchMode: themeStore.switchMode,
    cycleMode: themeStore.cycleMode,
    isTransitioning: themeStore.isTransitioning,
    transitionProgress: themeStore.transitionProgress,
    unlockedModes: themeStore.unlockedModes,
    isModeUnlocked: themeStore.isModeUnlocked,
    unlockMode: themeStore.unlockMode,
    checkUnlockRequirements: themeStore.checkUnlockRequirements,
    getAllModesWithStatus: themeStore.getAllModesWithStatus,
    getModePreview: themeStore.getModePreview
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Transition overlay */}
      {themeStore.isTransitioning && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${theme.colorPalette.primary}80, ${theme.colorPalette.secondary}80)`,
            opacity: Math.sin(themeStore.transitionProgress * Math.PI)
          }}
        />
      )}
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
