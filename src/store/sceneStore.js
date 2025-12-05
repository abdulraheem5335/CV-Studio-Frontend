/**
 * Scene Store - Manages scene transitions and interactive areas
 * Handles campus <-> sub-scene navigation with proper state management
 */

import { create } from 'zustand';

// Scene types
export const SCENE_TYPES = {
  CAMPUS: 'campus',
  FOOTBALL_GROUND: 'footballGround',
  CRICKET_GROUND: 'cricketGround',
  SPORTS_COMPLEX: 'sportsComplex',
};

// Interactive area configurations
export const INTERACTIVE_AREAS = {
  footballGround: {
    id: 'football_ground',
    name: 'Football Ground',
    position: { x: 1350, y: 800 },
    radius: 160,
    promptText: 'Press E to Enter Football Ground',
    exitText: 'Press ESC to Exit',
    sceneType: SCENE_TYPES.FOOTBALL_GROUND,
    cameraZoom: 1.4,
  },
  cricketGround: {
    id: 'cricket_ground',
    name: 'Cricket Ground',
    position: { x: 850, y: 800 },
    radius: 140,
    promptText: 'Press E to Enter Cricket Ground',
    exitText: 'Press ESC to Exit',
    sceneType: SCENE_TYPES.CRICKET_GROUND,
    cameraZoom: 1.3,
  },
  sportsComplex: {
    id: 'sports_complex',
    name: 'Sports Complex',
    position: { x: 1100, y: 700 },
    radius: 120,
    promptText: 'Press E to Enter Sports Complex',
    exitText: 'Press ESC to Exit',
    sceneType: SCENE_TYPES.SPORTS_COMPLEX,
    cameraZoom: 1.5,
  },
};

export const useSceneStore = create((set, get) => ({
  // Current scene state
  currentScene: SCENE_TYPES.CAMPUS,
  previousScene: null,
  
  // Player position tracking
  playerPosition: { x: 1150, y: 500 },
  savedCampusPosition: null, // Store position when entering sub-scene
  
  // Interactive area detection
  nearbyArea: null,
  canEnterArea: false,
  
  // Transition state
  isTransitioning: false,
  transitionProgress: 0,
  
  // Scene-specific data
  sceneData: {
    footballGround: {
      playerPosition: { x: 400, y: 300 },
      bounds: { x: 50, y: 50, width: 700, height: 500 },
    },
    cricketGround: {
      playerPosition: { x: 300, y: 250 },
      bounds: { x: 50, y: 50, width: 500, height: 400 },
    },
    sportsComplex: {
      playerPosition: { x: 200, y: 200 },
      bounds: { x: 50, y: 50, width: 400, height: 350 },
    },
  },
  
  // Update player position
  setPlayerPosition: (position) => {
    set({ playerPosition: position });
    get().checkProximity(position);
  },
  
  // Check proximity to interactive areas
  checkProximity: (position) => {
    const { currentScene } = get();
    if (currentScene !== SCENE_TYPES.CAMPUS) {
      set({ nearbyArea: null, canEnterArea: false });
      return;
    }
    
    let closestArea = null;
    let minDistSq = Infinity;
    
    Object.values(INTERACTIVE_AREAS).forEach((area) => {
      const dx = position.x - area.position.x;
      const dy = position.y - area.position.y;
      const distSq = dx * dx + dy * dy;
      const radiusSq = area.radius * area.radius;
      
      if (distSq < radiusSq && distSq < minDistSq) {
        minDistSq = distSq;
        closestArea = area;
      }
    });
    
    set({
      nearbyArea: closestArea,
      canEnterArea: closestArea !== null,
    });
  },
  
  // Enter a sub-scene
  enterScene: async (sceneType) => {
    const { currentScene, playerPosition, isTransitioning } = get();
    
    if (isTransitioning || currentScene !== SCENE_TYPES.CAMPUS) return false;
    
    const area = Object.values(INTERACTIVE_AREAS).find(a => a.sceneType === sceneType);
    if (!area) return false;
    
    set({ isTransitioning: true, transitionProgress: 0 });
    
    // Save current campus position
    set({ savedCampusPosition: { ...playerPosition } });
    
    // Animate transition
    const duration = 350;
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        set({ transitionProgress: progress });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Complete transition
          const sceneData = get().sceneData[sceneType === SCENE_TYPES.FOOTBALL_GROUND ? 'footballGround' : 
                                             sceneType === SCENE_TYPES.CRICKET_GROUND ? 'cricketGround' : 'sportsComplex'];
          
          set({
            previousScene: currentScene,
            currentScene: sceneType,
            playerPosition: { ...sceneData.playerPosition },
            nearbyArea: null,
            canEnterArea: false,
            isTransitioning: false,
            transitionProgress: 0,
          });
          
          resolve(true);
        }
      };
      
      requestAnimationFrame(animate);
    });
  },
  
  // Exit sub-scene and return to campus
  exitScene: async () => {
    const { currentScene, savedCampusPosition, isTransitioning } = get();
    
    if (isTransitioning || currentScene === SCENE_TYPES.CAMPUS) return false;
    
    set({ isTransitioning: true, transitionProgress: 0 });
    
    const duration = 350;
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        set({ transitionProgress: progress });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Return to campus
          set({
            previousScene: currentScene,
            currentScene: SCENE_TYPES.CAMPUS,
            playerPosition: savedCampusPosition || { x: 1150, y: 500 },
            savedCampusPosition: null,
            isTransitioning: false,
            transitionProgress: 0,
          });
          
          resolve(true);
        }
      };
      
      requestAnimationFrame(animate);
    });
  },
  
  // Enter football ground specifically
  enterFootballGround: () => {
    return get().enterScene(SCENE_TYPES.FOOTBALL_GROUND);
  },
  
  // Exit football ground
  exitFootballGround: () => {
    return get().exitScene();
  },
  
  // Get current scene config
  getCurrentSceneConfig: () => {
    const { currentScene } = get();
    if (currentScene === SCENE_TYPES.CAMPUS) return null;
    
    const areaKey = currentScene === SCENE_TYPES.FOOTBALL_GROUND ? 'footballGround' :
                    currentScene === SCENE_TYPES.CRICKET_GROUND ? 'cricketGround' : 'sportsComplex';
    
    return {
      area: INTERACTIVE_AREAS[areaKey],
      data: get().sceneData[areaKey],
    };
  },
  
  // Reset scene state
  resetScene: () => {
    set({
      currentScene: SCENE_TYPES.CAMPUS,
      previousScene: null,
      playerPosition: { x: 1150, y: 500 },
      savedCampusPosition: null,
      nearbyArea: null,
      canEnterArea: false,
      isTransitioning: false,
      transitionProgress: 0,
    });
  },
}));

export default useSceneStore;
