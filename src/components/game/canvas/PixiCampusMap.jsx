/**
 * PixiCampusMap - High-Performance Canvas/WebGL Campus Map
 * 
 * OPTIMIZED VERSION:
 * - Uses refs for real-time game state (no re-renders during gameplay)
 * - Viewport culling for off-screen objects
 * - Batched graphics rendering
 * - Object pooling for collectibles
 * - Throttled collision detection
 * - Scene transition support for sub-areas
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Application, Container, Graphics, Text } from 'pixi.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { useChatStore } from '../../../store/chatStore';
import { useSceneStore, SCENE_TYPES } from '../../../store/sceneStore';
import { useTheme, CoinIcon, XPStarIcon, GamepadIcon } from '../../ui';
import { FiZoomIn, FiZoomOut, FiX, FiMessageCircle } from 'react-icons/fi';

// Import map data and configs
import { CAMPUS_DATA, ROADS, MINIGAME_MARKERS, COLLECTIBLES, MAP_CONFIG } from './mapData';
import { getThemeConfig } from './themeConfigs';
import { ChatOverlay } from '../chat';
import { BUILDING_ICONS, MINIGAME_ICONS } from './iconRenderer';
// Visual effects - available for future use
// import { createParticleSystem, updateParticleSystem, createGlow, updateTreeSway, updateLanternFlicker, createScanlines } from './visualEffects';
import { TerrainGenerator } from './terrainGenerator';
import { createTree, createBench, createLamppost, createTrashcan, createFlowerbed, createBush, createSignpost, updatePropAnimations } from './propsGenerator';
import FootballGroundScene from './FootballGroundScene';
import InteractionPrompt from '../ui/InteractionPrompt';
import SceneTransition from '../ui/SceneTransition';

const PixiCampusMap = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const containersRef = useRef({});
  const characterRef = useRef(null);
  const terrainGeneratorRef = useRef(null);
  const animatedPropsRef = useRef([]);
  
  // Object pools for performance
  const objectPoolRef = useRef({
    coins: [],
    chatBubbles: [],
    playerSprites: [],
  });
  
  // Viewport culling bounds
  const viewportRef = useRef({
    left: 0, right: 0, top: 0, bottom: 0,
    padding: 100, // Extra padding for smooth transitions
  });
  
  // Performance tracking
  const perfRef = useRef({
    lastAnimationUpdate: 0,
    animationThrottle: 32, // ~30fps for animations
    lastPropUpdate: 0,
    propUpdateThrottle: 50, // Update props every 50ms
  });
  
  // Use refs for real-time game state (avoids re-renders)
  const gameStateRef = useRef({
    character: { x: 1150, y: 500, direction: 'down', isMoving: false, velocity: { x: 0, y: 0 } },
    camera: { x: 1150, y: 500, zoom: 1, targetZoom: 1 },
    keys: { w: false, a: false, s: false, d: false },
    collectedCoins: new Set(),
    nearbyLocation: null,
    lastCollisionCheck: 0,
  });
  
  const { user } = useAuthStore();
  const { theme, currentMode } = useTheme();
  const { connect, disconnect, updatePosition, isConnected } = useChatStore();
  
  // Scene management
  const { 
    currentScene, 
    canEnterArea, 
    nearbyArea,
    isTransitioning,
    checkProximity, 
    enterFootballGround, 
    exitFootballGround 
  } = useSceneStore();
  
  // Get allPlayers size for UI only (not for render loop)
  const allPlayersSize = useChatStore(state => state.allPlayers.size);
  
  // Only these need React state (trigger UI updates)
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [nearbyLocationUI, setNearbyLocationUI] = useState(null);
  const [coinCount, setCoinCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Track position updates for socket
  const lastPositionUpdate = useRef(0);
  const POSITION_UPDATE_INTERVAL = 100; // ms

  // Memoize theme config and locations
  const themeConfig = useMemo(() => getThemeConfig(currentMode), [currentMode]);
  const allLocations = useMemo(() => [
    ...CAMPUS_DATA.academic_blocks,
    ...CAMPUS_DATA.hostels_girls,
    ...CAMPUS_DATA.hostels_boys,
    ...CAMPUS_DATA.mess_blocks,
    ...CAMPUS_DATA.cafes,
    ...CAMPUS_DATA.sports_areas,
    ...CAMPUS_DATA.central_landmarks,
    ...CAMPUS_DATA.gates,
  ], []);

  // Initialize Pixi Application
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;
    
    const initPixi = async () => {
      const app = new Application();
      
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: themeConfig.backgroundColor,
        resolution: Math.min(window.devicePixelRatio || 1, 2), // Cap at 2x for performance
        autoDensity: true,
        antialias: currentMode !== 'pixel-retro',
        canvas: canvasRef.current,
        powerPreference: 'high-performance',
      });
      
      appRef.current = app;
      
      // Create layer containers
      const layers = ['terrain', 'roads', 'props', 'buildings', 'collectibles', 'character', 'chatBubbles'];
      layers.forEach((name, index) => {
        const container = new Container();
        container.zIndex = index;
        container.label = name;
        app.stage.addChild(container);
        containersRef.current[name] = container;
      });
      
      app.stage.sortableChildren = true;
      
      // Initialize all layers
      initializeTerrain();
      initializeRoads();
      initializeProps();
      initializeBuildings();
      initializeCollectibles();
      initializeCharacter();
      
      // Connect to chat server with user data
      connect(user);
      
      // Center camera on character
      gameStateRef.current.camera.x = gameStateRef.current.character.x;
      gameStateRef.current.camera.y = gameStateRef.current.character.y;
      
      setIsLoaded(true);
      
      // Start optimized game loop
      app.ticker.add(gameLoop);
    };
    
    initPixi();
    
    return () => {
      // Disconnect from chat server
      disconnect();
      
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, []);

  // Update theme - only rebuild when mode changes
  useEffect(() => {
    if (!appRef.current || !isLoaded) return;
    appRef.current.renderer.background.color = themeConfig.backgroundColor;
    rebuildVisuals();
  }, [currentMode, isLoaded]);

  // Optimized terrain using TerrainGenerator
  const initializeTerrain = useCallback(() => {
    const container = containersRef.current.terrain;
    if (!container) return;
    container.removeChildren();
    
    const { tileSize, mapWidth, mapHeight } = MAP_CONFIG;
    
    // Create or update terrain generator
    if (!terrainGeneratorRef.current) {
      terrainGeneratorRef.current = new TerrainGenerator(mapWidth, mapHeight, tileSize);
    }
    
    const generator = terrainGeneratorRef.current;
    
    // Apply theme-specific configuration
    const terrainConfig = {
      grassColors: themeConfig.terrain.variations,
      baseColor: themeConfig.terrain.baseColor,
      pathColor: themeConfig.roads?.baseColor || 0x78716C,
      waterColor: currentMode === 'cyberpunk-neon' ? 0x00FFFF : 
                  currentMode === 'cozy-campus' ? 0x60A5FA : 0x3B82F6,
    };
    
    // Determine season based on current month (or use summer as default)
    const month = new Date().getMonth();
    let season = 'summer';
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';
    
    // Apply seasonal theme
    generator.setSeasonalTheme(season);
    
    // Generate base terrain
    const terrain = generator.generateTerrain(terrainConfig);
    container.addChild(terrain);
    
    // Add water features (fountains near landmarks, small ponds)
    const waterAreas = [
      { x: 1200, y: 600, radius: 45, type: 'pond' }, // Near central area
      { x: 600, y: 400, radius: 30, type: 'fountain' }, // Near academic
      { x: 1800, y: 700, radius: 35, type: 'pond' }, // Near sports
    ];
    const waterContainer = generator.addWaterBodies(waterAreas);
    container.addChild(waterContainer);
    
    // Add decorative elements
    const decorContainer = generator.addDecorations(40);
    container.addChild(decorContainer);
    
    // Add grid overlay for pixel/cyberpunk modes
    if (currentMode === 'pixel-retro' || currentMode === 'cyberpunk-neon') {
      const grid = new Graphics();
      grid.stroke({ width: 1, color: themeConfig.terrain.gridColor, alpha: 0.15 });
      for (let x = 0; x <= mapWidth; x += tileSize * 2) {
        grid.moveTo(x, 0).lineTo(x, mapHeight);
      }
      for (let y = 0; y <= mapHeight; y += tileSize * 2) {
        grid.moveTo(0, y).lineTo(mapWidth, y);
      }
      container.addChild(grid);
    }
  }, [themeConfig, currentMode]);

  // Optimized roads - batched into single graphics
  const initializeRoads = useCallback(() => {
    const container = containersRef.current.roads;
    if (!container) return;
    container.removeChildren();
    
    const roads = new Graphics();
    const cap = currentMode === 'pixel-retro' ? 'square' : 'round';
    
    // Batch all roads into single draw calls
    ROADS.forEach((road) => {
      // Shadow
      roads.moveTo(road.from.x, road.from.y + 3).lineTo(road.to.x, road.to.y + 3);
      roads.stroke({ width: themeConfig.roads.width + 4, color: 0x000000, alpha: 0.15, cap });
      
      // Main road
      roads.moveTo(road.from.x, road.from.y).lineTo(road.to.x, road.to.y);
      roads.stroke({ width: themeConfig.roads.width, color: themeConfig.roads.baseColor, cap });
      
      // Center markings
      roads.moveTo(road.from.x, road.from.y).lineTo(road.to.x, road.to.y);
      roads.stroke({ width: 2, color: themeConfig.roads.markingColor, alpha: 0.5, cap });
    });
    
    // Cyberpunk glow effect
    if (currentMode === 'cyberpunk-neon') {
      ROADS.forEach((road) => {
        roads.moveTo(road.from.x, road.from.y).lineTo(road.to.x, road.to.y);
        roads.stroke({ width: themeConfig.roads.width + 6, color: themeConfig.roads.glowColor, alpha: 0.2, cap });
      });
    }
    
    container.addChild(roads);
  }, [themeConfig, currentMode]);

  // Enhanced props using propsGenerator
  const initializeProps = useCallback(() => {
    const container = containersRef.current.props;
    if (!container) return;
    container.removeChildren();
    container.sortableChildren = true;
    animatedPropsRef.current = [];
    
    const { mapWidth, mapHeight } = MAP_CONFIG;
    const density = themeConfig.props.density;
    
    // Determine season for props
    const month = new Date().getMonth();
    let season = 'summer';
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';
    
    // Pre-calculate road and building collision areas
    const roadAreas = ROADS.map(road => ({
      x1: Math.min(road.from.x, road.to.x) - 50,
      y1: Math.min(road.from.y, road.to.y) - 50,
      x2: Math.max(road.from.x, road.to.x) + 50,
      y2: Math.max(road.from.y, road.to.y) + 50,
    }));
    
    const buildingAreas = allLocations.map(loc => ({
      x1: loc.coordinates.x - 60,
      y1: loc.coordinates.y - 60,
      x2: loc.coordinates.x + 60,
      y2: loc.coordinates.y + 60,
    }));
    
    const isValidPosition = (x, y) => {
      return !roadAreas.some(r => x > r.x1 && x < r.x2 && y > r.y1 && y < r.y2) &&
             !buildingAreas.some(b => x > b.x1 && x < b.x2 && y > b.y1 && y < b.y2);
    };
    
    // Trees with variants
    const treeVariants = ['oak', 'pine', 'oak', 'cherry']; // Oak more common
    const treeSizes = ['small', 'medium', 'large', 'medium'];
    const treeCount = Math.min(density.trees, 30);
    
    for (let i = 0; i < treeCount; i++) {
      let x, y, attempts = 0;
      do {
        x = 100 + Math.random() * (mapWidth - 200);
        y = 100 + Math.random() * (mapHeight - 200);
        attempts++;
      } while (attempts < 15 && !isValidPosition(x, y));
      
      if (attempts < 15) {
        const variant = treeVariants[i % treeVariants.length];
        const size = treeSizes[Math.floor(Math.random() * treeSizes.length)];
        const tree = createTree(x, y, themeConfig, { variant, size, season });
        container.addChild(tree);
        if (tree.isAnimated) animatedPropsRef.current.push(tree);
      }
    }
    
    // Bushes around buildings
    allLocations.forEach((loc, idx) => {
      if (idx % 3 !== 0) return; // Every 3rd building
      const offsets = [
        { dx: -50, dy: 0 }, { dx: 50, dy: 0 },
        { dx: 0, dy: 45 }, { dx: -35, dy: 35 }
      ];
      offsets.forEach((off, oi) => {
        if (Math.random() > 0.6) return;
        const bush = createBush(
          loc.coordinates.x + off.dx,
          loc.coordinates.y + off.dy,
          themeConfig,
          { variant: oi % 2 === 0 ? 'round' : 'flowering' }
        );
        container.addChild(bush);
        if (bush.isAnimated) animatedPropsRef.current.push(bush);
      });
    });
    
    // Benches along roads
    ROADS.forEach((road, idx) => {
      if (idx % 2 !== 0) return;
      const mx = (road.from.x + road.to.x) / 2;
      const my = (road.from.y + road.to.y) / 2;
      const angle = Math.atan2(road.to.y - road.from.y, road.to.x - road.from.x);
      
      // Place bench perpendicular to road
      const offset = 30;
      const bench = createBench(
        mx + Math.sin(angle) * offset,
        my - Math.cos(angle) * offset,
        themeConfig,
        { variant: idx % 3 === 0 ? 'metal' : 'wooden', rotation: angle }
      );
      container.addChild(bench);
    });
    
    // Lampposts (cozy and classic modes)
    if (currentMode === 'cozy-campus' || currentMode === 'nust-classic') {
      ROADS.forEach((road, idx) => {
        if (idx % 2 !== 0) return;
        const dx = road.to.x - road.from.x;
        const dy = road.to.y - road.from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const count = Math.floor(len / 180);
        
        for (let i = 1; i < count; i++) {
          const t = i / count;
          const variant = currentMode === 'cozy-campus' ? 'ornate' : 'classic';
          const lamp = createLamppost(
            road.from.x + dx * t + (Math.random() - 0.5) * 20,
            road.from.y + dy * t + 25,
            themeConfig,
            { variant, isOn: true }
          );
          container.addChild(lamp);
          if (lamp.isAnimated) animatedPropsRef.current.push(lamp);
        }
      });
    }
    
    // Trash cans near buildings
    allLocations.forEach((loc, idx) => {
      if (idx % 5 !== 0) return;
      const trashcan = createTrashcan(
        loc.coordinates.x + 45,
        loc.coordinates.y + 30,
        themeConfig,
        { variant: idx % 2 === 0 ? 'bin' : 'recycle' }
      );
      container.addChild(trashcan);
    });
    
    // Flower beds near landmarks and hostels
    [...CAMPUS_DATA.central_landmarks, ...CAMPUS_DATA.hostels_girls.slice(0, 2)].forEach((loc, idx) => {
      const bed = createFlowerbed(
        loc.coordinates.x - 55,
        loc.coordinates.y,
        40, 25,
        themeConfig,
        { variant: idx % 3 === 0 ? 'tulips' : idx % 3 === 1 ? 'roses' : 'mixed', season }
      );
      container.addChild(bed);
    });
    
    // Signposts at intersections
    const signLocations = [
      { x: 800, y: 500, text: 'Academic', direction: 'left' },
      { x: 1500, y: 400, text: 'Hostels', direction: 'right' },
      { x: 1100, y: 800, text: 'Sports', direction: 'right' },
    ];
    signLocations.forEach((sign) => {
      const signpost = createSignpost(
        sign.x, sign.y, sign.text,
        themeConfig,
        { variant: 'direction', direction: sign.direction }
      );
      container.addChild(signpost);
    });
    
  }, [themeConfig, currentMode, allLocations]);

  // Optimized buildings
  const initializeBuildings = useCallback(() => {
    const container = containersRef.current.buildings;
    if (!container) return;
    container.removeChildren();
    container.sortableChildren = true;
    
    allLocations.forEach((location) => {
      const building = createBuilding(location);
      building.eventMode = 'static';
      building.cursor = 'pointer';
      building.on('pointerover', () => {
        building.scale.set(1.08);
        setNearbyLocationUI({ type: 'location', data: location });
      });
      building.on('pointerout', () => {
        building.scale.set(1);
      });
      building.on('pointertap', () => setSelectedLocation(location));
      container.addChild(building);
    });
  }, [themeConfig, currentMode, allLocations]);

  // Collectibles with object pooling potential
  const initializeCollectibles = useCallback(() => {
    const container = containersRef.current.collectibles;
    if (!container) return;
    container.removeChildren();
    
    const collected = gameStateRef.current.collectedCoins;
    
    COLLECTIBLES.forEach((coin) => {
      if (collected.has(coin.id)) return;
      const sprite = createCoin(coin);
      sprite.name = coin.id;
      sprite.baseY = coin.coordinates.y;
      container.addChild(sprite);
    });
    
    MINIGAME_MARKERS.forEach((mg) => {
      const marker = createMinigameMarker(mg);
      marker.name = mg.id;
      marker.baseY = mg.coordinates.y;
      container.addChild(marker);
    });
  }, [themeConfig]);

  // Character sprite
  const initializeCharacter = useCallback(() => {
    const container = containersRef.current.character;
    if (!container) return;
    container.removeChildren();
    
    const char = new Container();
    char.zIndex = 10000;
    
    // Shadow
    const shadow = new Graphics();
    shadow.ellipse(0, 14, 14, 5);
    shadow.fill({ color: 0x000000, alpha: 0.25 });
    char.addChild(shadow);
    
    // Glow
    const glow = new Graphics();
    glow.circle(0, 0, 22);
    glow.fill({ color: themeConfig.character.glowColor, alpha: 0.25 });
    char.addChild(glow);
    
    // Body
    const body = new Graphics();
    const isPixel = currentMode === 'pixel-retro';
    if (isPixel) body.rect(-14, -14, 28, 28);
    else body.circle(0, 0, 16);
    body.fill(user?.avatar?.color || themeConfig.character.color);
    body.stroke({ width: 2, color: 0xFFFFFF });
    char.addChild(body);
    
    // Direction indicator
    const face = new Graphics();
    face.circle(4, -4, 3);
    face.fill(0xFFFFFF);
    char.addChild(face);
    char.faceIndicator = face;
    
    // Name
    const name = new Text({
      text: user?.nickname || 'Explorer',
      style: { fontSize: 9, fill: 0xFFFFFF, stroke: { color: 0x000000, width: 2 } }
    });
    name.anchor.set(0.5);
    name.y = -28;
    char.addChild(name);
    
    char.x = gameStateRef.current.character.x;
    char.y = gameStateRef.current.character.y;
    characterRef.current = char;
    container.addChild(char);
  }, [themeConfig, currentMode, user]);

  // Building factory (kept local since it has complex theming)
  const createBuilding = (location) => {
    const building = new Container();
    building.x = location.coordinates.x;
    building.y = location.coordinates.y;
    building.zIndex = location.coordinates.y;
    
    const size = MAP_CONFIG.buildingSize;
    const cfg = themeConfig.buildings[location.type] || themeConfig.buildings.default;
    
    const g = new Graphics();
    // Shadow with gradient feel
    g.ellipse(0, size * 0.38, size * 0.48, size * 0.2);
    g.fill({ color: 0x000000, alpha: 0.3 });
    g.ellipse(0, size * 0.35, size * 0.45, size * 0.18);
    g.fill({ color: 0x000000, alpha: 0.2 });
    
    // Building body with subtle gradient effect (multiple layers)
    const baseColor = parseInt(location.color.replace('#', ''), 16);
    if (currentMode === 'pixel-retro') {
      g.rect(-size/2, -size/2, size, size);
      g.fill(baseColor);
      g.stroke({ width: 3, color: 0x000000, alpha: 0.8 });
    } else {
      // Outer glow for cyberpunk
      if (currentMode === 'cyberpunk-neon') {
        g.roundRect(-size/2 - 4, -size/2 - 4, size + 8, size + 8, 10);
        g.fill({ color: cfg.borderColor || 0x00FFFF, alpha: 0.15 });
      }
      g.roundRect(-size/2, -size/2, size, size, 8);
      g.fill(baseColor);
      // Highlight edge
      g.roundRect(-size/2, -size/2, size, size * 0.4, 8);
      g.fill({ color: 0xFFFFFF, alpha: 0.1 });
      g.stroke({ width: 2, color: cfg.borderColor || 0xFFFFFF, alpha: 0.5 });
    }
    
    // Windows with better detail
    const ws = size * 0.13, wg = size * 0.22;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const wx = -wg + c * wg * 1.5;
        const wy = -wg + r * wg * 1.2;
        // Window frame
        g.roundRect(wx - 1, wy - 1, ws + 2, ws + 2, 2);
        g.fill({ color: 0x000000, alpha: 0.3 });
        // Window glass
        g.roundRect(wx, wy, ws, ws, 2);
        g.fill({ color: cfg.windowColor || 0xFEF3C7, alpha: 0.7 });
        // Window reflection
        g.roundRect(wx + 1, wy + 1, ws * 0.4, ws * 0.3, 1);
        g.fill({ color: 0xFFFFFF, alpha: 0.4 });
      }
    }
    
    // Door with more detail
    g.roundRect(-size * 0.1, size * 0.08, size * 0.2, size * 0.28, 2);
    g.fill(cfg.doorColor || 0x4B5563);
    g.roundRect(-size * 0.08, size * 0.1, size * 0.16, size * 0.24, 2);
    g.fill({ color: 0x000000, alpha: 0.2 });
    // Door handle
    g.circle(size * 0.04, size * 0.22, 2);
    g.fill({ color: 0xFFD700, alpha: 0.8 });
    
    building.addChild(g);
    
    // Vector icon instead of emoji
    const iconContainer = new Container();
    const iconG = new Graphics();
    const iconType = location.iconType || location.type;
    const iconFn = BUILDING_ICONS[iconType] || BUILDING_ICONS.landmark;
    if (iconFn) {
      iconFn(iconG, 14, 0xFFFFFF);
    }
    iconContainer.addChild(iconG);
    iconContainer.y = -size * 0.32;
    // Add subtle icon background
    const iconBg = new Graphics();
    iconBg.circle(0, 0, 16);
    iconBg.fill({ color: baseColor, alpha: 0.9 });
    iconBg.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.5 });
    iconContainer.addChildAt(iconBg, 0);
    building.addChild(iconContainer);
    
    // Label with better styling
    const label = new Text({
      text: location.name,
      style: { 
        fontSize: 10, 
        fill: themeConfig.ui.textColor, 
        fontFamily: currentMode === 'pixel-retro' ? 'monospace' : 'Arial',
        fontWeight: 'bold',
        dropShadow: currentMode !== 'pixel-retro',
        dropShadowColor: 0x000000,
        dropShadowBlur: 2,
        dropShadowDistance: 1,
      }
    });
    label.anchor.set(0.5, 0);
    label.y = size * 0.52;
    building.addChild(label);
    
    return building;
  };

  const createCoin = (coin) => {
    const c = new Container();
    c.x = coin.coordinates.x;
    c.y = coin.coordinates.y;
    c.zIndex = 500;
    const g = new Graphics();
    
    if (coin.type === 'xp') {
      // XP orb with glow
      g.circle(0, 0, 18);
      g.fill({ color: 0x22D3EE, alpha: 0.2 });
      g.circle(0, 0, 12);
      g.fill({ color: 0x06B6D4, alpha: 0.9 });
      g.stroke({ width: 2, color: 0x22D3EE, alpha: 0.8 });
      g.circle(-3, -3, 4);
      g.fill({ color: 0xFFFFFF, alpha: 0.5 });
    } else {
      // Gold coin with star
      g.circle(0, 0, 12);
      g.fill({ color: 0xFACC15, alpha: 0.95 });
      g.stroke({ width: 2.5, color: 0xCA8A04, alpha: 0.9 });
      g.circle(0, 0, 8);
      g.fill({ color: 0xFDE047, alpha: 0.9 });
      // Star in center
      const starR = 4;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * starR;
        const y = Math.sin(angle) * starR;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      g.fill({ color: 0xCA8A04, alpha: 0.8 });
      // Shine
      g.circle(-3, -3, 2);
      g.fill({ color: 0xFFFFFF, alpha: 0.6 });
    }
    c.addChild(g);
    return c;
  };

  const createMinigameMarker = (mg) => {
    const c = new Container();
    c.x = mg.coordinates.x;
    c.y = mg.coordinates.y;
    c.zIndex = 1000;
    
    // Outer glow ring
    const glow = new Graphics();
    glow.circle(0, 0, 26);
    glow.fill({ color: themeConfig.ui.accentColor, alpha: 0.15 });
    c.addChild(glow);
    
    // Main circle background
    const bg = new Graphics();
    bg.circle(0, 0, 20);
    bg.fill({ color: themeConfig.ui.accentColor, alpha: 0.95 });
    bg.stroke({ width: 3, color: 0xFFFFFF, alpha: 0.5 });
    c.addChild(bg);
    
    // Vector icon
    const iconG = new Graphics();
    const iconFn = MINIGAME_ICONS[mg.type];
    if (iconFn) {
      iconFn(iconG, 14, 0xFFFFFF);
    }
    c.addChild(iconG);
    
    // Pulsing animation marker
    c.pulseGlow = glow;
    
    return c;
  };

  // Calculate viewport bounds for culling
  const updateViewportBounds = useCallback(() => {
    const state = gameStateRef.current;
    const viewport = viewportRef.current;
    const halfW = (window.innerWidth / 2) / state.camera.zoom;
    const halfH = (window.innerHeight / 2) / state.camera.zoom;
    
    viewport.left = state.camera.x - halfW - viewport.padding;
    viewport.right = state.camera.x + halfW + viewport.padding;
    viewport.top = state.camera.y - halfH - viewport.padding;
    viewport.bottom = state.camera.y + halfH + viewport.padding;
  }, []);
  
  // Check if object is in viewport
  const isInViewport = useCallback((x, y, margin = 0) => {
    const v = viewportRef.current;
    return x >= v.left - margin && x <= v.right + margin &&
           y >= v.top - margin && y <= v.bottom + margin;
  }, []);
  
  // Apply viewport culling to a container
  const applyViewportCulling = useCallback((container) => {
    if (!container) return;
    container.children.forEach((child) => {
      if (child.x !== undefined && child.y !== undefined) {
        const wasVisible = child.visible;
        const shouldBeVisible = isInViewport(child.x, child.y, 50);
        if (wasVisible !== shouldBeVisible) {
          child.visible = shouldBeVisible;
        }
      }
    });
  }, [isInViewport]);

  // Optimized game loop with viewport culling and smooth movement
  const gameLoop = useCallback((ticker) => {
    if (!appRef.current || !characterRef.current) return;
    
    // Skip game loop when in another scene
    const sceneState = useSceneStore.getState();
    if (sceneState.currentScene !== SCENE_TYPES.CAMPUS) return;
    
    const state = gameStateRef.current;
    const perf = perfRef.current;
    const delta = ticker.deltaTime;
    const time = ticker.lastTime;
    
    // === CHARACTER MOVEMENT WITH SMOOTHING ===
    let dx = 0, dy = 0;
    const keys = state.keys;
    if (keys.w) dy -= 1;
    if (keys.s) dy += 1;
    if (keys.a) dx -= 1;
    if (keys.d) dx += 1;
    
    // Smooth acceleration/deceleration
    const acceleration = 0.15;
    const friction = 0.85;
    const maxSpeed = 3.5;
    
    if (dx !== 0 || dy !== 0) {
      // Normalize diagonal
      if (dx !== 0 && dy !== 0) {
        const len = Math.SQRT1_2;
        dx *= len; dy *= len;
      }
      
      // Apply acceleration
      state.character.velocity.x += dx * acceleration * delta;
      state.character.velocity.y += dy * acceleration * delta;
      
      // Clamp velocity
      const vLen = Math.sqrt(state.character.velocity.x ** 2 + state.character.velocity.y ** 2);
      if (vLen > maxSpeed) {
        state.character.velocity.x = (state.character.velocity.x / vLen) * maxSpeed;
        state.character.velocity.y = (state.character.velocity.y / vLen) * maxSpeed;
      }
      
      state.character.direction = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';
      state.character.isMoving = true;
    } else {
      // Apply friction when no input
      state.character.velocity.x *= friction;
      state.character.velocity.y *= friction;
      
      // Stop if velocity is very small
      if (Math.abs(state.character.velocity.x) < 0.01) state.character.velocity.x = 0;
      if (Math.abs(state.character.velocity.y) < 0.01) state.character.velocity.y = 0;
      state.character.isMoving = state.character.velocity.x !== 0 || state.character.velocity.y !== 0;
    }
    
    // Apply velocity
    const newX = state.character.x + state.character.velocity.x * delta;
    const newY = state.character.y + state.character.velocity.y * delta;
    
    // Bounds check
    if (newX > 50 && newX < MAP_CONFIG.mapWidth - 50) {
      state.character.x = newX;
    } else {
      state.character.velocity.x = 0;
    }
    if (newY > 50 && newY < MAP_CONFIG.mapHeight - 50) {
      state.character.y = newY;
    } else {
      state.character.velocity.y = 0;
    }
    
    // Update sprite position
    characterRef.current.x = state.character.x;
    characterRef.current.y = state.character.y;
    
    // Update face indicator
    const face = characterRef.current.faceIndicator;
    if (face) {
      face.x = state.character.direction === 'left' ? -6 : state.character.direction === 'right' ? 6 : 0;
      face.y = state.character.direction === 'up' ? -6 : state.character.direction === 'down' ? 6 : -4;
    }
    
    // === SMOOTH CAMERA ===
    const camLerp = 0.1;
    state.camera.x += (state.character.x - state.camera.x) * camLerp;
    state.camera.y += (state.character.y - state.camera.y) * camLerp;
    
    // Smooth zoom transition
    if (Math.abs(state.camera.zoom - state.camera.targetZoom) > 0.001) {
      state.camera.zoom += (state.camera.targetZoom - state.camera.zoom) * 0.1;
    }
    
    // Apply camera transform
    const stage = appRef.current.stage;
    stage.x = -state.camera.x * state.camera.zoom + window.innerWidth / 2;
    stage.y = -state.camera.y * state.camera.zoom + window.innerHeight / 2;
    stage.scale.set(state.camera.zoom);
    
    // Update viewport bounds for culling
    updateViewportBounds();
    
    // === VIEWPORT CULLING ===
    applyViewportCulling(containersRef.current.props);
    applyViewportCulling(containersRef.current.buildings);
    applyViewportCulling(containersRef.current.collectibles);
    
    // === THROTTLED ANIMATIONS ===
    // Animate collectibles (throttled)
    if (time - perf.lastAnimationUpdate > perf.animationThrottle) {
      perf.lastAnimationUpdate = time;
      
      const collectibles = containersRef.current.collectibles;
      if (collectibles) {
        collectibles.children.forEach((child, i) => {
          if (!child.visible) return; // Skip culled objects
          if (child.baseY !== undefined) {
            child.y = child.baseY + Math.sin(time * 0.003 + i) * 3;
            if (child.name?.startsWith('coin')) {
              child.scale.x = 0.8 + Math.abs(Math.cos(time * 0.002 + i)) * 0.2;
            }
          }
        });
      }
    }
    
    // Update animated props (throttled)
    if (time - perf.lastPropUpdate > perf.propUpdateThrottle) {
      perf.lastPropUpdate = time;
      
      if (animatedPropsRef.current.length > 0) {
        // Only update visible props
        const visibleProps = animatedPropsRef.current.filter(p => p.visible !== false);
        updatePropAnimations(visibleProps, time, 0.5);
      }
      
      // Update water animations
      if (terrainGeneratorRef.current) {
        terrainGeneratorRef.current.updateWaterAnimation(time);
      }
    }
    
    // Throttled collision detection (every 100ms)
    if (time - state.lastCollisionCheck > 100) {
      state.lastCollisionCheck = time;
      checkCollisions(state, time);
    }
    
    // Send position updates to chat server (throttled)
    if (time - lastPositionUpdate.current > POSITION_UPDATE_INTERVAL) {
      lastPositionUpdate.current = time;
      updatePosition(state.character.x, state.character.y);
    }
    
    // Render nearby players and chat bubbles
    renderNearbyPlayers(time);
  }, [updateViewportBounds, applyViewportCulling]);

  // Collision detection
  const checkCollisions = useCallback((state, time) => {
    const collectibles = containersRef.current.collectibles;
    if (!collectibles) return;
    
    // Coin collection
    collectibles.children.forEach((child) => {
      if (!child.name?.startsWith('coin') || !child.visible) return;
      if (state.collectedCoins.has(child.name)) return;
      
      const dx = state.character.x - child.x;
      const dy = state.character.y - child.y;
      if (dx * dx + dy * dy < 900) { // 30^2
        state.collectedCoins.add(child.name);
        child.visible = false;
        setCoinCount(state.collectedCoins.size);
      }
    });
    
    // Check for interactive areas (football ground, etc.)
    checkProximity({ x: state.character.x, y: state.character.y });
    
    // Nearby location (for UI prompt)
    let nearest = null;
    let minDistSq = 6400; // 80^2
    
    allLocations.forEach(loc => {
      const dx = state.character.x - loc.coordinates.x;
      const dy = state.character.y - loc.coordinates.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < minDistSq) {
        minDistSq = distSq;
        nearest = { type: 'location', data: loc };
      }
    });
    
    if (nearest !== state.nearbyLocation) {
      state.nearbyLocation = nearest;
      setNearbyLocationUI(nearest);
    }
  }, [allLocations, checkProximity]);

  // Render nearby players from chat server
  const nearbyPlayersRef = useRef(new Map()); // Store player sprites
  const chatBubblesRef = useRef(new Map()); // Store active chat bubbles
  const lastPlayerRender = useRef(0);
  const PLAYER_RENDER_INTERVAL = 100; // Throttle player rendering
  
  const renderNearbyPlayers = useCallback((time) => {
    // Throttle rendering
    if (time - lastPlayerRender.current < PLAYER_RENDER_INTERVAL) return;
    lastPlayerRender.current = time;
    
    const charContainer = containersRef.current.character;
    const chatContainer = containersRef.current.chatBubbles;
    if (!charContainer || !chatContainer) return;
    
    // Get store state directly (not reactive)
    const { allPlayers, chatBubbles } = useChatStore.getState();
    
    const currentPlayers = nearbyPlayersRef.current;
    const currentBubbles = chatBubblesRef.current;
    
    // Get current nearby player IDs (allPlayers is a Map)
    const nearbyIds = new Set(allPlayers.keys());
    
    // Remove players who left proximity
    currentPlayers.forEach((sprite, odId) => {
      if (!nearbyIds.has(odId)) {
        charContainer.removeChild(sprite);
        sprite.destroy({ children: true });
        currentPlayers.delete(odId);
      }
    });
    
    // Helper: Create other player sprite inline
    const makePlayerSprite = (player) => {
      const cont = new Container();
      cont.zIndex = player.y;
      const shadow = new Graphics();
      shadow.ellipse(0, 14, 12, 4);
      shadow.fill({ color: 0x000000, alpha: 0.2 });
      cont.addChild(shadow);
      const body = new Graphics();
      const isPixel = currentMode === 'pixel-retro';
      if (isPixel) body.rect(-12, -12, 24, 24);
      else body.circle(0, 0, 14);
      body.fill(player.avatar?.color || themeConfig.character.color);
      body.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.8 });
      cont.addChild(body);
      const name = new Text({
        text: player.nickname || 'Player',
        style: { fontSize: 8, fill: 0xFFFFFF, stroke: { color: 0x000000, width: 2 } }
      });
      name.anchor.set(0.5);
      name.y = -22;
      cont.addChild(name);
      cont.x = player.x;
      cont.y = player.y;
      return cont;
    };
    
    // Helper: Create chat bubble inline
    const makeBubble = (msg) => {
      const cont = new Container();
      cont.zIndex = 10000;
      // Backend sends 'message' property, not 'text'
      const msgText = msg.message || msg.text || '';
      const displayText = msgText.length > 50 ? msgText.slice(0, 50) + '...' : msgText;
      const text = new Text({
        text: displayText,
        style: { fontSize: 10, fill: themeConfig.ui.textColor, wordWrap: true, wordWrapWidth: 120 },
      });
      text.anchor.set(0.5);
      const padding = 8;
      const bubbleWidth = Math.min(text.width + padding * 2, 140);
      const bubbleHeight = text.height + padding * 2;
      const bg = new Graphics();
      const bgColor = msg.isOwn ? themeConfig.ui.accentColor : 0xFFFFFF;
      bg.roundRect(-bubbleWidth/2, -bubbleHeight - 8, bubbleWidth, bubbleHeight, 8);
      bg.fill({ color: bgColor, alpha: 0.95 });
      bg.moveTo(-5, -8);
      bg.lineTo(0, 0);
      bg.lineTo(5, -8);
      bg.fill({ color: bgColor, alpha: 0.95 });
      cont.addChild(bg);
      text.y = -bubbleHeight/2 - 8;
      text.style.fill = msg.isOwn ? 0xFFFFFF : 0x1F2937;
      cont.addChild(text);
      return cont;
    };
    
    // Add or update nearby players
    allPlayers.forEach((player, odId) => {
      let sprite = currentPlayers.get(odId);
      
      if (!sprite) {
        sprite = makePlayerSprite(player);
        charContainer.addChild(sprite);
        currentPlayers.set(odId, sprite);
      }
      
      // Update position smoothly
      sprite.x += (player.x - sprite.x) * 0.2;
      sprite.y += (player.y - sprite.y) * 0.2;
      sprite.zIndex = player.y;
    });
    
    // Render chat bubbles (chatBubbles is an array)
    const activeBubbleIds = new Set((chatBubbles || []).map(b => b.id));
    
    // Remove expired bubbles
    currentBubbles.forEach((bubble, id) => {
      const elapsed = time - bubble.timestamp;
      if (elapsed > 4000 || !activeBubbleIds.has(id)) {
        chatContainer.removeChild(bubble.container);
        bubble.container.destroy({ children: true });
        currentBubbles.delete(id);
      } else {
        if (elapsed > 3500) {
          bubble.container.alpha = 1 - (elapsed - 3500) / 500;
        }
        const player = allPlayers.get(bubble.playerId);
        if (player) {
          bubble.container.x = player.x;
          bubble.container.y = player.y - 50;
        }
      }
    });
    
    // Add new bubbles
    (chatBubbles || []).forEach((msg) => {
      if (currentBubbles.has(msg.id)) return;
      
      const bubbleContainer = makeBubble(msg);
      const player = allPlayers.get(msg.odId);
      if (player) {
        bubbleContainer.x = player.x;
        bubbleContainer.y = player.y - 50;
      } else if (msg.isOwn) {
        bubbleContainer.x = gameStateRef.current.character.x;
        bubbleContainer.y = gameStateRef.current.character.y - 50;
      }
      
      chatContainer.addChild(bubbleContainer);
      currentBubbles.set(msg.id, {
        container: bubbleContainer,
        timestamp: msg.timestamp,
        playerId: msg.odId,
      });
    });
  }, [currentMode, themeConfig]);

  // Rebuild visuals
  const rebuildVisuals = useCallback(() => {
    initializeTerrain();
    initializeRoads();
    initializeProps();
    initializeBuildings();
    initializeCollectibles();
    initializeCharacter();
  }, [initializeTerrain, initializeRoads, initializeProps, initializeBuildings, initializeCollectibles, initializeCharacter]);

  // Keyboard handlers with enhanced controls
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const state = gameStateRef.current;
      
      // Don't handle keys if in another scene or transitioning
      const sceneState = useSceneStore.getState();
      if (sceneState.currentScene !== SCENE_TYPES.CAMPUS || sceneState.isTransitioning) {
        return;
      }
      
      // Movement keys
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
        if (key === 'w' || key === 'arrowup') state.keys.w = true;
        if (key === 'a' || key === 'arrowleft') state.keys.a = true;
        if (key === 's' || key === 'arrowdown') state.keys.s = true;
        if (key === 'd' || key === 'arrowright') state.keys.d = true;
      }
      
      // E for interaction - check interactive areas first, then locations
      if (key === 'e' || key === 'enter') {
        // Check if near an interactive area (football ground, etc.)
        if (sceneState.canEnterArea && sceneState.nearbyArea) {
          e.preventDefault();
          if (sceneState.nearbyArea.sceneType === SCENE_TYPES.FOOTBALL_GROUND) {
            enterFootballGround();
          }
          return;
        }
        
        // Otherwise check for building interaction
        if (state.nearbyLocation) {
          setSelectedLocation(state.nearbyLocation.data);
        }
      }
      
      // ESC to close modals/chat
      if (key === 'escape') {
        if (selectedLocation) {
          setSelectedLocation(null);
        } else if (isChatOpen) {
          setIsChatOpen(false);
        }
      }
      
      // C to toggle chat
      if (key === 'c' && !e.ctrlKey) {
        setIsChatOpen(prev => !prev);
      }
      
      // +/- for zoom
      if (key === '=' || key === '+') {
        handleZoom(0.1);
      }
      if (key === '-') {
        handleZoom(-0.1);
      }
    };
    
    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      const state = gameStateRef.current;
      if (key === 'w' || key === 'arrowup') state.keys.w = false;
      if (key === 'a' || key === 'arrowleft') state.keys.a = false;
      if (key === 's' || key === 'arrowdown') state.keys.s = false;
      if (key === 'd' || key === 'arrowright') state.keys.d = false;
    };
    
    // Mouse wheel zoom
    const onWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.08 : 0.08;
      handleZoom(zoomDelta);
    };
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvasRef.current?.addEventListener('wheel', onWheel, { passive: false });
    
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvasRef.current?.removeEventListener('wheel', onWheel);
    };
  }, [selectedLocation, isChatOpen, enterFootballGround]);

  // Smooth zoom handler
  const handleZoom = useCallback((delta) => {
    const state = gameStateRef.current;
    state.camera.targetZoom = Math.min(Math.max(state.camera.targetZoom + delta, 0.5), 2.5);
    setZoomLevel(Math.round(state.camera.targetZoom * 100) / 100);
  }, []);

  // Window resize
  useEffect(() => {
    const onResize = () => {
      if (appRef.current) {
        appRef.current.renderer.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Scene Transition Overlay */}
      <SceneTransition />
      
      {/* Main Campus Scene */}
      {currentScene === SCENE_TYPES.CAMPUS && (
        <>
          <canvas ref={canvasRef} className="absolute inset-0" />
          
          {/* Loading */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: themeConfig.backgroundColor }}>
              <div className="text-center">
                <div className="animate-bounce mb-4"><GamepadIcon size={48} color={theme.colorPalette.primary} /></div>
                <p style={{ color: theme.colorPalette.text.primary }}>Loading Campus...</p>
              </div>
            </div>
          )}
          
          {/* React UI */}
          {isLoaded && (
            <>
              {/* HUD */}
              <div className="absolute top-4 left-4 z-50">
                <div className="backdrop-blur-lg p-4 rounded-xl" style={{ background: theme.colorPalette.surface + 'dd', border: `1px solid ${theme.colorPalette.primary}30` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: user?.avatar?.color || theme.colorPalette.primary }}>
                      {user?.nickname?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: theme.colorPalette.text.primary }}>{user?.nickname || 'Explorer'}</p>
                      <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>Level {user?.level || 1}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CoinIcon size={16} color={theme.colorPalette.coins} />
                      <span style={{ color: theme.colorPalette.text.primary }}>{coinCount}/{COLLECTIBLES.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <XPStarIcon size={16} color={theme.colorPalette.xp} />
                      <span style={{ color: theme.colorPalette.text.primary }}>{user?.xp || 0}</span>
                    </div>
                    <div className="flex items-center gap-1" title={isConnected ? 'Online' : 'Offline'}>
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: isConnected ? '#22C55E' : '#EF4444' }}
                      />
                      <span style={{ color: theme.colorPalette.text.muted }} className="text-xs">
                        {allPlayersSize} nearby
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleZoom(0.2)} className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur" style={{ background: theme.colorPalette.surface + 'dd', color: theme.colorPalette.text.primary, border: `1px solid ${theme.colorPalette.primary}30` }}>
                  <FiZoomIn />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleZoom(-0.2)} className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur" style={{ background: theme.colorPalette.surface + 'dd', color: theme.colorPalette.text.primary, border: `1px solid ${theme.colorPalette.primary}30` }}>
                  <FiZoomOut />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }} 
                  onClick={() => setIsChatOpen(!isChatOpen)} 
                  className="w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur relative"
                  style={{ 
                    background: isChatOpen ? theme.colorPalette.primary : theme.colorPalette.surface + 'dd', 
                    color: isChatOpen ? '#FFFFFF' : theme.colorPalette.text.primary, 
                    border: `1px solid ${theme.colorPalette.primary}30` 
                  }}
                >
                  <FiMessageCircle />
                  {allPlayersSize > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white"
                      style={{ backgroundColor: '#22C55E' }}
                    >
                      {allPlayersSize}
                    </span>
                  )}
                </motion.button>
              </div>
              
              {/* Chat Overlay */}
              <ChatOverlay isOpen={isChatOpen} onToggle={() => setIsChatOpen(false)} />
              
              {/* Interactive Area Prompt (Football Ground, etc.) */}
              <InteractionPrompt />
              
              {/* Building Interaction Prompt */}
              <AnimatePresence>
                {nearbyLocationUI && !canEnterArea && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg backdrop-blur" style={{ background: theme.colorPalette.surface + 'ee', border: `1px solid ${theme.colorPalette.primary}50` }}>
                    <p className="text-center" style={{ color: theme.colorPalette.text.primary }}>
                      Press <kbd className="px-2 py-0.5 rounded mx-1" style={{ background: theme.colorPalette.primary + '30' }}>E</kbd> to enter <strong>{nearbyLocationUI.data?.name}</strong>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Location Panel */}
              <AnimatePresence>
                {selectedLocation && (
                  <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} className="absolute top-4 right-20 bottom-4 w-80 rounded-2xl backdrop-blur overflow-hidden z-50" style={{ background: theme.colorPalette.surface + 'f5', border: `1px solid ${theme.colorPalette.primary}30` }}>
                    <div className="p-6" style={{ backgroundColor: selectedLocation.color + '30' }}>
                      <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: selectedLocation.color }}>{selectedLocation.icon}</div>
                        <button onClick={() => setSelectedLocation(null)} className="p-2 rounded-lg hover:bg-black/10" style={{ color: theme.colorPalette.text.primary }}><FiX /></button>
                      </div>
                      <h2 className="text-xl font-bold mt-4" style={{ color: theme.colorPalette.text.primary }}>{selectedLocation.name}</h2>
                      <p className="text-sm capitalize" style={{ color: selectedLocation.color }}>{selectedLocation.type.replace('_', ' ')}</p>
                    </div>
                    <div className="p-4">
                      <p style={{ color: theme.colorPalette.text.muted }}>{selectedLocation.description || 'Explore this location to discover more!'}</p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl text-center" style={{ background: theme.colorPalette.background }}>
                          <p className="text-lg" style={{ color: theme.colorPalette.text.primary }}>0</p>
                          <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>Online</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: theme.colorPalette.background }}>
                          <p className="text-lg" style={{ color: theme.colorPalette.text.primary }}>+50 XP</p>
                          <p className="text-xs" style={{ color: theme.colorPalette.text.muted }}>Visit Reward</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Controls hint */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full backdrop-blur text-sm" style={{ background: theme.colorPalette.surface + 'aa', color: theme.colorPalette.text.muted }}>
                Use <kbd className="px-1.5 py-0.5 rounded mx-1" style={{ background: theme.colorPalette.primary + '30' }}>WASD</kbd> to move
              </div>
            </>
          )}
        </>
      )}
      
      {/* Football Ground Scene */}
      {currentScene === SCENE_TYPES.FOOTBALL_GROUND && (
        <FootballGroundScene onExit={exitFootballGround} />
      )}
    </div>
  );
};

export default PixiCampusMap;
