import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { PixiCampusMap } from '../components/game/canvas';
import { useTheme } from '../components/ui';

const GameMode = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate('/portal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleExit = () => {
    navigate('/portal');
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
      {/* Exit Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleExit}
        className="absolute top-4 right-20 z-50 p-3 rounded-full backdrop-blur-md shadow-lg transition-all"
        style={{ 
          background: `${theme.colorPalette.surface}ee`,
          border: `1px solid ${theme.colorPalette.primary}30`,
          color: theme.colorPalette.text.primary
        }}
        title="Exit to Portal (ESC)"
      >
        <FiX size={24} />
      </motion.button>

      {/* Main Game View - WebGL Canvas */}
      <PixiCampusMap />
    </div>
  );
};

export default GameMode;
