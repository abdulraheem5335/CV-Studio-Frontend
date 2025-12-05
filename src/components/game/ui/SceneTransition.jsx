/**
 * SceneTransition - Fade overlay for smooth scene transitions
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useSceneStore } from '../../../store/sceneStore';

const SceneTransition = () => {
  const { isTransitioning, transitionProgress } = useSceneStore();
  
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: transitionProgress < 0.5 ? transitionProgress * 2 : (1 - transitionProgress) * 2 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, #0f172a 0%, #000000 100%)',
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default SceneTransition;
