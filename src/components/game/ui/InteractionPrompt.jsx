/**
 * InteractionPrompt - Floating UI panel for area interactions
 * Shows when player is near interactive areas
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useSceneStore, SCENE_TYPES } from '../../../store/sceneStore';

const InteractionPrompt = () => {
  const { currentScene, canEnterArea, nearbyArea, isTransitioning } = useSceneStore();
  
  // Only show on campus when near an interactive area
  const shouldShow = currentScene === SCENE_TYPES.CAMPUS && canEnterArea && nearbyArea && !isTransitioning;
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed z-50 pointer-events-none"
          style={{
            bottom: 'clamp(80px, 12vh, 140px)',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div 
            className="relative px-6 py-4 rounded-2xl backdrop-blur-lg border shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 30, 30, 0.9) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              minWidth: 'clamp(200px, 40vw, 320px)',
            }}
          >
            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-30 blur-xl -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
              }}
            />
            
            {/* Content */}
            <div className="flex flex-col items-center gap-2">
              {/* Area name */}
              <span 
                className="text-white font-bold tracking-wide"
                style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)' }}
              >
                {nearbyArea.name}
              </span>
              
              {/* Prompt text */}
              <div className="flex items-center gap-2">
                <span 
                  className="text-gray-300"
                  style={{ fontSize: 'clamp(0.75rem, 1vw, 0.9rem)' }}
                >
                  Press
                </span>
                <kbd 
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-white shadow-inner"
                  style={{
                    background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
                    fontSize: 'clamp(0.8rem, 1.1vw, 1rem)',
                    minWidth: '32px',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  E
                </kbd>
                <span 
                  className="text-gray-300"
                  style={{ fontSize: 'clamp(0.75rem, 1vw, 0.9rem)' }}
                >
                  to Enter
                </span>
              </div>
            </div>
            
            {/* Animated border accent */}
            <motion.div
              className="absolute bottom-0 left-1/2 h-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #3B82F6, transparent)',
                width: '60%',
                transform: 'translateX(-50%)',
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InteractionPrompt;
