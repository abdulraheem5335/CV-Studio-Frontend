/**
 * FootballGroundScene - Enhanced Realistic Multiplayer Football Field
 * 
 * Features:
 * - Real-time multiplayer with Socket.io
 * - Stamina system with sprint mechanics
 * - Variable kick power (hold to charge)
 * - Animated grass effects
 * - Dynamic shadows
 * - Camera shake and easing
 * - Goal celebrations with particles
 * - Touch controls for mobile
 * - Responsive design
 */

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Application, Container, Graphics, Text, BlurFilter, Ticker } from 'pixi.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useSceneStore, SCENE_TYPES } from '../../../store/sceneStore';
import { useChatStore } from '../../../store/chatStore';
import { useAuthStore } from '../../../store/authStore';
import useFootballStore, { FOOTBALL_CONFIG } from '../../../store/footballStore';
import { useTheme, TrophyIcon } from '../../ui';
import { getThemeConfig } from './themeConfigs';
import { FiUsers, FiZap, FiTarget } from 'react-icons/fi';

// Ground configuration
const GROUND_CONFIG = {
  width: 800,
  height: 600,
  fieldPadding: 40,
  lineWidth: 3,
  goalWidth: 80,
  goalDepth: 25,
  centerCircleRadius: 50,
  penaltyAreaWidth: 180,
  penaltyAreaDepth: 60,
  cornerArcRadius: 15,
};

// Movement bounds
const BOUNDS = {
  minX: 50,
  minY: 50,
  maxX: GROUND_CONFIG.width - 50,
  maxY: GROUND_CONFIG.height - 50,
};

// Ball configuration
const BALL_CONFIG = {
  radius: 10,
  color: 0xFFFFFF,
  shadowColor: 0x000000,
  trailLength: 8,
};

// Team colors
const TEAM_COLORS = {
  red: { primary: 0xEF4444, secondary: 0xFCA5A5, glow: 0xEF4444 },
  blue: { primary: 0x3B82F6, secondary: 0x93C5FD, glow: 0x3B82F6 },
};

// Grass blade colors for variety
const GRASS_COLORS = [0x2d5a27, 0x3d7a37, 0x4a8a44, 0x357a2f];

const FootballGroundScene = ({ onExit }) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const containersRef = useRef({});
  const characterRef = useRef(null);
  const ballRef = useRef(null);
  const ballTrailRef = useRef([]);
  const grassBladesRef = useRef([]);
  const remotePlayersRef = useRef(new Map());
  const celebrationParticlesRef = useRef([]);
  const isDestroyedRef = useRef(false); // Track if component is destroyed
  
  const gameStateRef = useRef({
    position: { x: 400, y: 300 },
    velocity: { x: 0, y: 0 },
    direction: { x: 0, y: 1 }, // Normalized direction vector
    keys: { w: false, a: false, s: false, d: false, space: false, shift: false },
    lastPosition: { x: 400, y: 300 },
  });
  const cameraRef = useRef({ x: 400, y: 300, zoom: 1.4, shakeOffset: { x: 0, y: 0 } });
  
  // Touch control refs
  const touchJoystickRef = useRef({ active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });
  const touchKickRef = useRef({ active: false, startTime: 0 });
  
  const { currentScene, exitScene } = useSceneStore();
  const { socket, isConnected } = useChatStore();
  const { user } = useAuthStore();
  const { currentMode, theme } = useTheme();
  const themeConfig = getThemeConfig(currentMode);
  
  // Football store
  const {
    isInGround,
    groundPlayers,
    localPlayer,
    localPlayerState,
    ball,
    score,
    lastGoalBy,
    isGoalAnimation,
    isPlaying,
    cameraShake,
    enterGround,
    leaveGround,
    updatePosition,
    updateStamina,
    startKickCharge,
    executeKick,
    getKickChargePercent,
    updateCameraShake,
    triggerCameraShake,
    interpolateRemotePlayers,
    handlePlayerJoined,
    handlePlayerLeft,
    handlePlayerMoved,
    handlePlayersList,
    handleBallUpdate,
    handleGoalScored,
    handleGameState,
    CONFIG,
  } = useFootballStore();
  
  const [showControls, setShowControls] = useState(true);
  const [kickChargePercent, setKickChargePercent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Responsive scaling
  const getResponsiveScale = useCallback(() => {
    const baseWidth = 1920;
    const scale = Math.min(window.innerWidth / baseWidth, 1.5);
    return Math.max(scale, 0.5);
  }, []);
  
  // Initialize socket listeners
  useEffect(() => {
    if (!socket || !isConnected) return;
    if (currentScene !== SCENE_TYPES.FOOTBALL_GROUND) return;
    
    enterGround(socket, user, gameStateRef.current.position);
    
    socket.on('football:playerJoined', handlePlayerJoined);
    socket.on('football:playerLeft', handlePlayerLeft);
    socket.on('football:playerMoved', handlePlayerMoved);
    socket.on('football:playersList', handlePlayersList);
    socket.on('football:ballUpdate', handleBallUpdate);
    socket.on('football:goalScored', handleGoalScored);
    socket.on('football:gameState', handleGameState);
    
    return () => {
      socket.off('football:playerJoined', handlePlayerJoined);
      socket.off('football:playerLeft', handlePlayerLeft);
      socket.off('football:playerMoved', handlePlayerMoved);
      socket.off('football:playersList', handlePlayersList);
      socket.off('football:ballUpdate', handleBallUpdate);
      socket.off('football:goalScored', handleGoalScored);
      socket.off('football:gameState', handleGameState);
      
      leaveGround(socket);
    };
  }, [socket, isConnected, currentScene, user]);
  
  // Update kick charge UI
  useEffect(() => {
    const interval = setInterval(() => {
      setKickChargePercent(getKickChargePercent());
    }, 50);
    return () => clearInterval(interval);
  }, [getKickChargePercent]);
  
  // Create remote player sprite
  const createPlayerSprite = useCallback((playerData) => {
    const container = new Container();
    const teamColor = TEAM_COLORS[playerData.team] || TEAM_COLORS.blue;
    
    // Shadow
    const shadow = new Graphics();
    shadow.ellipse(0, 14, 14, 6);
    shadow.fill({ color: 0x000000, alpha: 0.25 });
    container.addChild(shadow);
    
    // Outer glow
    const glow = new Graphics();
    glow.circle(0, 0, 20);
    glow.fill({ color: teamColor.glow, alpha: 0.15 });
    container.addChild(glow);
    
    // Body
    const body = new Graphics();
    const isPixel = currentMode === 'pixel-retro';
    
    if (isPixel) {
      body.rect(-12, -12, 24, 24);
    } else {
      body.circle(0, 0, 14);
    }
    body.fill({ color: teamColor.primary, alpha: 1 });
    body.stroke({ width: 3, color: 0xFFFFFF, alpha: 0.9 });
    container.addChild(body);
    
    // Team ring
    const ring = new Graphics();
    ring.circle(0, 0, 18);
    ring.stroke({ width: 2, color: teamColor.secondary, alpha: 0.6 });
    container.addChild(ring);
    
    // Name label
    const nameText = new Text({
      text: playerData.nickname || 'Player',
      style: {
        fontFamily: 'Arial',
        fontSize: 10,
        fill: 0xFFFFFF,
        stroke: { color: 0x000000, width: 2 },
        align: 'center',
      }
    });
    nameText.anchor.set(0.5, 0);
    nameText.y = -30;
    container.addChild(nameText);
    
    container.zIndex = 500;
    container.position.set(playerData.x || 400, playerData.y || 300);
    
    return container;
  }, [currentMode]);
  
  // Update remote players
  useEffect(() => {
    if (!containersRef.current.players) return;
    
    const playerContainer = containersRef.current.players;
    
    groundPlayers.forEach((playerData, socketId) => {
      let sprite = remotePlayersRef.current.get(socketId);
      
      if (!sprite) {
        sprite = createPlayerSprite(playerData);
        playerContainer.addChild(sprite);
        remotePlayersRef.current.set(socketId, sprite);
      }
      
      if (playerData.position) {
        sprite.x = playerData.position.x;
        sprite.y = playerData.position.y;
      }
    });
    
    remotePlayersRef.current.forEach((sprite, socketId) => {
      if (!groundPlayers.has(socketId)) {
        playerContainer.removeChild(sprite);
        sprite.destroy();
        remotePlayersRef.current.delete(socketId);
      }
    });
  }, [groundPlayers, createPlayerSprite]);
  
  // Update ball position and effects
  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.x = ball.x;
      ballRef.current.y = ball.y;
      
      // Update ball rotation based on velocity
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed > 0.5) {
        ballRef.current.rotation += speed * 0.05;
      }
    }
  }, [ball.x, ball.y, ball.vx, ball.vy]);
  
  // Initialize Pixi application
  useEffect(() => {
    if (!canvasRef.current || appRef.current) return;
    if (currentScene !== SCENE_TYPES.FOOTBALL_GROUND) return;
    
    const initScene = async () => {
      const app = new Application();
      
      // Calculate responsive dimensions
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(window.innerWidth, 800);
      const height = Math.max(window.innerHeight, 600);
      
      await app.init({
        width: width,
        height: height,
        backgroundColor: 0x1a472a,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
        antialias: currentMode !== 'pixel-retro',
        canvas: canvas,
        powerPreference: 'high-performance',
      });
      
      appRef.current = app;
      
      // Create scene layers
      const layerNames = ['field', 'grass', 'markings', 'objects', 'ballTrail', 'ball', 'players', 'character', 'particles', 'ui'];
      
      layerNames.forEach((name, index) => {
        const container = new Container();
        container.zIndex = index * 100;
        container.label = name;
        app.stage.addChild(container);
        containersRef.current[name] = container;
      });
      
      app.stage.sortableChildren = true;
      
      // Render scene
      renderField(containersRef.current.field);
      renderAnimatedGrass(containersRef.current.grass);
      renderMarkings(containersRef.current.markings);
      renderGoals(containersRef.current.objects);
      renderStadiumEdge(containersRef.current.objects);
      renderBall(containersRef.current.ball);
      renderCharacter(containersRef.current.character);
      
      // Set initial camera
      const scale = getResponsiveScale();
      cameraRef.current.zoom = 1.4 * scale;
      
      // Reset destroyed flag
      isDestroyedRef.current = false;
      
      // Start game loop
      app.ticker.add(gameLoop);
    };
    
    initScene();
    
    return () => {
      // Set destroyed flag first to stop game loop
      isDestroyedRef.current = true;
      
      if (appRef.current) {
        // Stop the ticker first
        appRef.current.ticker.stop();
        appRef.current.ticker.remove(gameLoop);
        
        // Clear all refs before destroying
        characterRef.current = null;
        ballRef.current = null;
        containersRef.current = {};
        
        // Now destroy the app
        try {
          appRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
        } catch (e) {
          console.warn('PixiJS cleanup warning:', e.message);
        }
        appRef.current = null;
      }
      remotePlayersRef.current.clear();
      grassBladesRef.current = [];
      ballTrailRef.current = [];
      celebrationParticlesRef.current = [];
    };
  }, [currentScene, currentMode]);
  
  // Render grass field
  const renderField = useCallback((container) => {
    const g = new Graphics();
    const { width, height, fieldPadding } = GROUND_CONFIG;
    
    // Base grass gradient
    g.rect(0, 0, width, height);
    g.fill({ color: 0x2d5a27, alpha: 1 });
    
    // Grass stripes (mowing pattern)
    const stripeWidth = 40;
    const stripeCount = Math.ceil(width / stripeWidth);
    
    for (let i = 0; i < stripeCount; i++) {
      if (i % 2 === 0) {
        g.rect(fieldPadding + i * stripeWidth, fieldPadding, stripeWidth, height - fieldPadding * 2);
        g.fill({ color: 0x3d7a37, alpha: 0.35 });
      }
    }
    
    container.addChild(g);
  }, []);
  
  // Animated grass blades
  const renderAnimatedGrass = useCallback((container) => {
    grassBladesRef.current = [];
    const { width, height, fieldPadding } = GROUND_CONFIG;
    
    // Create grass blade graphics (pooled for performance)
    for (let i = 0; i < 150; i++) {
      const blade = new Graphics();
      const x = fieldPadding + Math.random() * (width - fieldPadding * 2);
      const y = fieldPadding + Math.random() * (height - fieldPadding * 2);
      const bladeHeight = 3 + Math.random() * 4;
      const color = GRASS_COLORS[Math.floor(Math.random() * GRASS_COLORS.length)];
      
      blade.moveTo(0, 0);
      blade.lineTo(-1, -bladeHeight);
      blade.lineTo(1, -bladeHeight);
      blade.closePath();
      blade.fill({ color, alpha: 0.6 });
      
      blade.x = x;
      blade.y = y;
      blade.pivot.set(0, 0);
      
      grassBladesRef.current.push({
        graphics: blade,
        baseX: x,
        baseY: y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.02,
        amplitude: 0.3 + Math.random() * 0.3,
      });
      
      container.addChild(blade);
    }
  }, []);
  
  // Field markings
  const renderMarkings = useCallback((container) => {
    const g = new Graphics();
    const { width, height, fieldPadding, lineWidth, centerCircleRadius, 
            penaltyAreaWidth, penaltyAreaDepth, goalWidth, cornerArcRadius } = GROUND_CONFIG;
    
    const lineColor = 0xFFFFFF;
    const lineAlpha = 0.9;
    
    // Field outline
    g.rect(fieldPadding, fieldPadding, width - fieldPadding * 2, height - fieldPadding * 2);
    g.stroke({ width: lineWidth, color: lineColor, alpha: lineAlpha });
    
    // Center line
    const centerX = width / 2;
    const centerY = height / 2;
    g.moveTo(centerX, fieldPadding);
    g.lineTo(centerX, height - fieldPadding);
    g.stroke({ width: lineWidth, color: lineColor, alpha: lineAlpha });
    
    // Center circle
    g.circle(centerX, centerY, centerCircleRadius);
    g.stroke({ width: lineWidth, color: lineColor, alpha: lineAlpha });
    
    // Center spot
    g.circle(centerX, centerY, 5);
    g.fill({ color: lineColor, alpha: lineAlpha });
    
    // Penalty areas
    const paTop = (height - penaltyAreaWidth) / 2;
    g.rect(fieldPadding, paTop, penaltyAreaDepth, penaltyAreaWidth);
    g.stroke({ width: lineWidth, color: lineColor, alpha: lineAlpha });
    g.rect(width - fieldPadding - penaltyAreaDepth, paTop, penaltyAreaDepth, penaltyAreaWidth);
    g.stroke({ width: lineWidth, color: lineColor, alpha: lineAlpha });
    
    // Goal areas
    const gaTop = (height - goalWidth) / 2;
    g.rect(fieldPadding, gaTop, 25, goalWidth);
    g.stroke({ width: lineWidth - 1, color: lineColor, alpha: lineAlpha * 0.8 });
    g.rect(width - fieldPadding - 25, gaTop, 25, goalWidth);
    g.stroke({ width: lineWidth - 1, color: lineColor, alpha: lineAlpha * 0.8 });
    
    // Penalty spots
    g.circle(fieldPadding + penaltyAreaDepth - 15, centerY, 3);
    g.fill({ color: lineColor, alpha: lineAlpha });
    g.circle(width - fieldPadding - penaltyAreaDepth + 15, centerY, 3);
    g.fill({ color: lineColor, alpha: lineAlpha });
    
    // Corner arcs
    const corners = [
      { x: fieldPadding, y: fieldPadding, startAngle: 0, endAngle: Math.PI / 2 },
      { x: width - fieldPadding, y: fieldPadding, startAngle: Math.PI / 2, endAngle: Math.PI },
      { x: width - fieldPadding, y: height - fieldPadding, startAngle: Math.PI, endAngle: Math.PI * 1.5 },
      { x: fieldPadding, y: height - fieldPadding, startAngle: Math.PI * 1.5, endAngle: Math.PI * 2 },
    ];
    
    corners.forEach((corner) => {
      g.arc(corner.x, corner.y, cornerArcRadius, corner.startAngle, corner.endAngle);
      g.stroke({ width: lineWidth - 1, color: lineColor, alpha: lineAlpha * 0.8 });
    });
    
    container.addChild(g);
  }, []);
  
  // Goals with net animation
  const renderGoals = useCallback((container) => {
    const { width, height, fieldPadding, goalWidth, goalDepth } = GROUND_CONFIG;
    const goalColor = 0xFFFFFF;
    const netColor = 0xCCCCCC;
    const goalTop = (height - goalWidth) / 2;
    
    // Left goal (Blue team scores here - Red team's goal)
    const leftGoal = new Graphics();
    
    // Goal frame
    leftGoal.rect(fieldPadding - goalDepth, goalTop, goalDepth, goalWidth);
    leftGoal.stroke({ width: 5, color: goalColor, alpha: 1 });
    
    // Net pattern
    for (let i = 0; i < goalWidth; i += 8) {
      leftGoal.moveTo(fieldPadding - goalDepth, goalTop + i);
      leftGoal.lineTo(fieldPadding, goalTop + i);
      leftGoal.stroke({ width: 1, color: netColor, alpha: 0.4 });
    }
    for (let i = 0; i < goalDepth; i += 8) {
      leftGoal.moveTo(fieldPadding - goalDepth + i, goalTop);
      leftGoal.lineTo(fieldPadding - goalDepth + i, goalTop + goalWidth);
      leftGoal.stroke({ width: 1, color: netColor, alpha: 0.4 });
    }
    
    // Team indicator
    leftGoal.rect(fieldPadding - goalDepth - 6, goalTop, 6, goalWidth);
    leftGoal.fill({ color: TEAM_COLORS.blue.primary, alpha: 0.8 });
    
    leftGoal.zIndex = 100;
    container.addChild(leftGoal);
    
    // Right goal (Red team scores here - Blue team's goal)
    const rightGoal = new Graphics();
    
    rightGoal.rect(width - fieldPadding, goalTop, goalDepth, goalWidth);
    rightGoal.stroke({ width: 5, color: goalColor, alpha: 1 });
    
    for (let i = 0; i < goalWidth; i += 8) {
      rightGoal.moveTo(width - fieldPadding, goalTop + i);
      rightGoal.lineTo(width - fieldPadding + goalDepth, goalTop + i);
      rightGoal.stroke({ width: 1, color: netColor, alpha: 0.4 });
    }
    for (let i = 0; i < goalDepth; i += 8) {
      rightGoal.moveTo(width - fieldPadding + i, goalTop);
      rightGoal.lineTo(width - fieldPadding + i, goalTop + goalWidth);
      rightGoal.stroke({ width: 1, color: netColor, alpha: 0.4 });
    }
    
    rightGoal.rect(width - fieldPadding + goalDepth, goalTop, 6, goalWidth);
    rightGoal.fill({ color: TEAM_COLORS.red.primary, alpha: 0.8 });
    
    rightGoal.zIndex = 100;
    container.addChild(rightGoal);
  }, []);
  
  // Stadium edge with crowd
  const renderStadiumEdge = useCallback((container) => {
    const { width, height } = GROUND_CONFIG;
    const wallHeight = 30;
    const wallColor = 0x4A5568;
    const wallHighlight = 0x718096;
    
    const walls = new Graphics();
    
    // Walls
    walls.moveTo(0, 0);
    walls.lineTo(0, wallHeight);
    walls.lineTo(width, wallHeight);
    walls.lineTo(width, 0);
    walls.closePath();
    walls.fill({ color: wallColor, alpha: 0.9 });
    
    walls.rect(0, wallHeight - 5, width, 5);
    walls.fill({ color: wallHighlight, alpha: 0.6 });
    
    walls.moveTo(0, height);
    walls.lineTo(0, height - wallHeight);
    walls.lineTo(width, height - wallHeight);
    walls.lineTo(width, height);
    walls.closePath();
    walls.fill({ color: wallColor, alpha: 0.9 });
    
    walls.rect(0, height - wallHeight, width, 5);
    walls.fill({ color: wallHighlight, alpha: 0.6 });
    
    walls.rect(0, wallHeight, wallHeight, height - wallHeight * 2);
    walls.fill({ color: wallColor, alpha: 0.85 });
    walls.rect(wallHeight - 5, wallHeight, 5, height - wallHeight * 2);
    walls.fill({ color: wallHighlight, alpha: 0.5 });
    
    walls.rect(width - wallHeight, wallHeight, wallHeight, height - wallHeight * 2);
    walls.fill({ color: wallColor, alpha: 0.85 });
    walls.rect(width - wallHeight, wallHeight, 5, height - wallHeight * 2);
    walls.fill({ color: wallHighlight, alpha: 0.5 });
    
    // Animated crowd (simple colored seats)
    for (let i = 0; i < width; i += 20) {
      const seatColor = i % 40 === 0 ? 0xEF4444 : 0x3B82F6;
      walls.rect(i + 2, 5, 16, 10);
      walls.fill({ color: seatColor, alpha: 0.7 });
    }
    
    for (let i = 0; i < width; i += 20) {
      const seatColor = i % 40 === 0 ? 0x22C55E : 0xFBBF24;
      walls.rect(i + 2, height - 15, 16, 10);
      walls.fill({ color: seatColor, alpha: 0.7 });
    }
    
    walls.zIndex = 200;
    container.addChild(walls);
  }, []);
  
  // Ball with shadow and trail
  const renderBall = useCallback((container) => {
    const ballContainer = new Container();
    
    // Shadow
    const shadow = new Graphics();
    shadow.ellipse(0, 5, BALL_CONFIG.radius * 0.9, 4);
    shadow.fill({ color: BALL_CONFIG.shadowColor, alpha: 0.25 });
    shadow.y = BALL_CONFIG.radius - 2;
    ballContainer.addChild(shadow);
    
    // Ball body
    const ballGraphics = new Graphics();
    ballGraphics.circle(0, 0, BALL_CONFIG.radius);
    ballGraphics.fill({ color: BALL_CONFIG.color });
    ballGraphics.stroke({ width: 1.5, color: 0x333333, alpha: 1 });
    
    // Pentagon pattern
    const patternColor = 0x333333;
    const angles = [0, 72, 144, 216, 288].map(a => (a * Math.PI) / 180);
    angles.forEach(angle => {
      const px = Math.cos(angle) * 5;
      const py = Math.sin(angle) * 5;
      ballGraphics.circle(px, py, 3);
      ballGraphics.fill({ color: patternColor });
    });
    
    ballContainer.addChild(ballGraphics);
    
    ballContainer.x = GROUND_CONFIG.width / 2;
    ballContainer.y = GROUND_CONFIG.height / 2;
    ballContainer.zIndex = 400;
    
    ballRef.current = ballContainer;
    container.addChild(ballContainer);
  }, []);
  
  // Local character with direction indicator
  const renderCharacter = useCallback((container) => {
    const char = new Container();
    char.zIndex = 1000;
    
    const team = localPlayer?.team || 'blue';
    const teamColor = TEAM_COLORS[team];
    
    // Shadow
    const shadow = new Graphics();
    shadow.ellipse(0, 14, 14, 6);
    shadow.fill({ color: 0x000000, alpha: 0.25 });
    char.addChild(shadow);
    
    // Sprint effect ring (shown when sprinting)
    const sprintRing = new Graphics();
    sprintRing.circle(0, 0, 22);
    sprintRing.stroke({ width: 2, color: 0xFFD700, alpha: 0 });
    sprintRing.label = 'sprintRing';
    char.addChild(sprintRing);
    
    // Body
    const body = new Graphics();
    const isPixel = currentMode === 'pixel-retro';
    
    if (isPixel) {
      body.rect(-12, -12, 24, 24);
    } else {
      body.circle(0, 0, 14);
    }
    body.fill({ color: teamColor.primary, alpha: 1 });
    body.stroke({ width: 3, color: 0xFFFFFF, alpha: 0.9 });
    char.addChild(body);
    
    // Gold ring for local player
    const ring = new Graphics();
    ring.circle(0, 0, 18);
    ring.stroke({ width: 3, color: 0xFFD700, alpha: 0.8 });
    char.addChild(ring);
    
    // Direction indicator (arrow)
    const arrow = new Graphics();
    arrow.moveTo(0, -20);
    arrow.lineTo(-6, -14);
    arrow.lineTo(6, -14);
    arrow.closePath();
    arrow.fill({ color: 0xFFFFFF, alpha: 0.9 });
    arrow.label = 'directionArrow';
    char.addChild(arrow);
    
    // Name label
    const nameText = new Text({
      text: user?.nickname || 'You',
      style: {
        fontFamily: 'Arial',
        fontSize: 11,
        fill: 0xFFD700,
        stroke: { color: 0x000000, width: 3 },
        align: 'center',
        fontWeight: 'bold',
      }
    });
    nameText.anchor.set(0.5, 0);
    nameText.y = -35;
    char.addChild(nameText);
    
    // Position
    const state = gameStateRef.current;
    char.x = state.position.x;
    char.y = state.position.y;
    
    characterRef.current = char;
    container.addChild(char);
  }, [currentMode, localPlayer, user]);
  
  // Game loop with all physics
  const gameLoop = useCallback((ticker) => {
    // Check if destroyed before accessing any refs
    if (isDestroyedRef.current || !appRef.current || !characterRef.current) return;
    
    const state = gameStateRef.current;
    const delta = ticker.deltaTime;
    const deltaMs = delta * (1000 / 60); // Convert to ms
    const camera = cameraRef.current;
    
    // ============================================
    // PLAYER MOVEMENT PHYSICS
    // ============================================
    let dx = 0, dy = 0;
    const { keys } = state;
    
    // Touch joystick input
    if (touchJoystickRef.current.active) {
      const jDx = touchJoystickRef.current.currentX - touchJoystickRef.current.startX;
      const jDy = touchJoystickRef.current.currentY - touchJoystickRef.current.startY;
      const jLen = Math.sqrt(jDx * jDx + jDy * jDy);
      const maxDist = 50;
      if (jLen > 10) {
        dx = (jDx / jLen) * Math.min(jLen / maxDist, 1);
        dy = (jDy / jLen) * Math.min(jLen / maxDist, 1);
      }
    } else {
      // Keyboard input
      if (keys.w) dy -= 1;
      if (keys.s) dy += 1;
      if (keys.a) dx -= 1;
      if (keys.d) dx += 1;
    }
    
    // Sprint check
    const wantsSprint = keys.shift;
    const canSprint = updateStamina(deltaMs, wantsSprint && (dx !== 0 || dy !== 0));
    
    // Movement parameters
    const acceleration = CONFIG.PLAYER_ACCELERATION;
    const friction = CONFIG.PLAYER_FRICTION;
    const maxSpeed = canSprint ? CONFIG.PLAYER_SPRINT_SPEED : CONFIG.PLAYER_BASE_SPEED;
    
    if (dx !== 0 || dy !== 0) {
      // Normalize diagonal movement
      if (dx !== 0 && dy !== 0) {
        const len = Math.SQRT1_2;
        dx *= len;
        dy *= len;
      }
      
      // Apply acceleration
      state.velocity.x += dx * acceleration * delta;
      state.velocity.y += dy * acceleration * delta;
      
      // Clamp to max speed
      const vLen = Math.sqrt(state.velocity.x ** 2 + state.velocity.y ** 2);
      if (vLen > maxSpeed) {
        state.velocity.x = (state.velocity.x / vLen) * maxSpeed;
        state.velocity.y = (state.velocity.y / vLen) * maxSpeed;
      }
      
      // Update direction for kick/facing
      state.direction.x = dx;
      state.direction.y = dy;
      const dirLen = Math.sqrt(state.direction.x ** 2 + state.direction.y ** 2);
      if (dirLen > 0) {
        state.direction.x /= dirLen;
        state.direction.y /= dirLen;
      }
    } else {
      // Apply friction
      state.velocity.x *= friction;
      state.velocity.y *= friction;
      
      if (Math.abs(state.velocity.x) < 0.01) state.velocity.x = 0;
      if (Math.abs(state.velocity.y) < 0.01) state.velocity.y = 0;
    }
    
    // Apply velocity with bounds
    state.lastPosition.x = state.position.x;
    state.lastPosition.y = state.position.y;
    
    const newX = state.position.x + state.velocity.x * delta;
    const newY = state.position.y + state.velocity.y * delta;
    
    if (newX > BOUNDS.minX && newX < BOUNDS.maxX) {
      state.position.x = newX;
    } else {
      state.velocity.x = 0;
    }
    
    if (newY > BOUNDS.minY && newY < BOUNDS.maxY) {
      state.position.y = newY;
    } else {
      state.velocity.y = 0;
    }
    
    // Update character sprite (with null check)
    if (!characterRef.current) return;
    characterRef.current.x = state.position.x;
    characterRef.current.y = state.position.y;
    
    // Update direction arrow
    const arrow = characterRef.current.children?.find(c => c.label === 'directionArrow');
    if (arrow) {
      const angle = Math.atan2(state.direction.y, state.direction.x) + Math.PI / 2;
      arrow.rotation = angle;
    }
    
    // Update sprint visual
    const sprintRing = characterRef.current.children?.find(c => c.label === 'sprintRing');
    if (sprintRing) {
      sprintRing.alpha = canSprint ? 0.5 + Math.sin(Date.now() * 0.01) * 0.3 : 0;
    }
    
    // Sync position to server
    if (socket && isConnected && (state.velocity.x !== 0 || state.velocity.y !== 0)) {
      updatePosition(socket, state.position, state.velocity);
    }
    
    // ============================================
    // BALL-PLAYER COLLISION & MOMENTUM TRANSFER
    // ============================================
    // Check collision between ball and this player
    const playerRadius = CONFIG.PLAYER_RADIUS || 15;
    const ballRadius = BALL_CONFIG.radius || 8;
    const collisionDist = playerRadius + ballRadius;
    
    const dx_to_ball = ball.x - state.position.x;
    const dy_to_ball = ball.y - state.position.y;
    const dist_to_ball = Math.sqrt(dx_to_ball * dx_to_ball + dy_to_ball * dy_to_ball);
    
    if (dist_to_ball < collisionDist && socket && isConnected) {
      // Transfer player momentum to ball via socket
      const momentumTransfer = CONFIG.BALL_PLAYER_MOMENTUM_TRANSFER || 0.6;
      const newVx = ball.vx + state.velocity.x * momentumTransfer;
      const newVy = ball.vy + state.velocity.y * momentumTransfer;
      
      // Push ball away from player to prevent sticking
      const pushStrength = (collisionDist - dist_to_ball + 1) / collisionDist;
      const pushX = (dx_to_ball / (dist_to_ball || 1)) * pushStrength;
      const pushY = (dy_to_ball / (dist_to_ball || 1)) * pushStrength;
      
      // Emit ball update to server
      socket.emit('ball:update', {
        x: ball.x + pushX,
        y: ball.y + pushY,
        vx: newVx,
        vy: newVy,
      });
      
      // Visual feedback - shake camera slightly
      triggerCameraShake(2, 0.1);
    }
    
    // ============================================
    // KICK HANDLING
    // ============================================
    if (keys.space || touchKickRef.current.active) {
      // Try to execute kick
      const kicked = executeKick(socket, state.position, state.direction);
      if (kicked) {
        keys.space = false;
        touchKickRef.current.active = false;
      }
    }
    
    // ============================================
    // GRASS ANIMATION
    // ============================================
    grassBladesRef.current.forEach(blade => {
      const time = Date.now() * blade.speed;
      const sway = Math.sin(time + blade.phase) * blade.amplitude;
      blade.graphics.rotation = sway * 0.3;
      
      // React to ball proximity
      const bdx = blade.baseX - ball.x;
      const bdy = blade.baseY - ball.y;
      const bDist = Math.sqrt(bdx * bdx + bdy * bdy);
      if (bDist < 30) {
        const pushStrength = (30 - bDist) / 30;
        blade.graphics.rotation += (bdx > 0 ? 1 : -1) * pushStrength * 0.5;
      }
    });
    
    // ============================================
    // INTERPOLATE REMOTE PLAYERS
    // ============================================
    interpolateRemotePlayers();
    
    // ============================================
    // CAMERA
    // ============================================
    // Update camera shake
    updateCameraShake(deltaMs);
    
    // Apply camera shake
    if (cameraShake.duration > 0) {
      camera.shakeOffset.x = (Math.random() - 0.5) * cameraShake.intensity;
      camera.shakeOffset.y = (Math.random() - 0.5) * cameraShake.intensity;
    } else {
      camera.shakeOffset.x *= 0.9;
      camera.shakeOffset.y *= 0.9;
    }
    
    // Smooth camera follow with easing
    const targetX = state.position.x;
    const targetY = state.position.y;
    camera.x += (targetX - camera.x) * 0.08;
    camera.y += (targetY - camera.y) * 0.08;
    
    // Apply camera transform (with null check)
    if (!appRef.current?.stage) return;
    const stage = appRef.current.stage;
    stage.x = -camera.x * camera.zoom + window.innerWidth / 2 + camera.shakeOffset.x;
    stage.y = -camera.y * camera.zoom + window.innerHeight / 2 + camera.shakeOffset.y;
    stage.scale.set(camera.zoom);
    
  }, [socket, isConnected, updatePosition, executeKick, interpolateRemotePlayers, updateStamina, updateCameraShake, ball, cameraShake, CONFIG]);
  
  // Keyboard handlers
  useEffect(() => {
    if (currentScene !== SCENE_TYPES.FOOTBALL_GROUND) return;
    
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const state = gameStateRef.current;
      
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift'].includes(key)) {
        e.preventDefault();
        if (key === 'w' || key === 'arrowup') state.keys.w = true;
        if (key === 'a' || key === 'arrowleft') state.keys.a = true;
        if (key === 's' || key === 'arrowdown') state.keys.s = true;
        if (key === 'd' || key === 'arrowright') state.keys.d = true;
        if (key === ' ') {
          if (!state.keys.space) {
            startKickCharge();
          }
          state.keys.space = true;
        }
        if (key === 'shift') state.keys.shift = true;
      }
      
      if (key === 'escape') {
        exitScene();
        if (onExit) onExit();
      }
      
      if (key === 'h') {
        setShowControls(prev => !prev);
      }
    };
    
    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      const state = gameStateRef.current;
      
      if (key === 'w' || key === 'arrowup') state.keys.w = false;
      if (key === 'a' || key === 'arrowleft') state.keys.a = false;
      if (key === 's' || key === 'arrowdown') state.keys.s = false;
      if (key === 'd' || key === 'arrowright') state.keys.d = false;
      if (key === ' ') state.keys.space = false;
      if (key === 'shift') state.keys.shift = false;
    };
    
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [currentScene, exitScene, onExit, startKickCharge]);
  
  // Touch handlers for mobile
  useEffect(() => {
    if (!isMobile || currentScene !== SCENE_TYPES.FOOTBALL_GROUND) return;
    
    const onTouchStart = (e) => {
      const touch = e.touches[0];
      const screenWidth = window.innerWidth;
      
      // Left side = joystick
      if (touch.clientX < screenWidth * 0.4) {
        touchJoystickRef.current = {
          active: true,
          startX: touch.clientX,
          startY: touch.clientY,
          currentX: touch.clientX,
          currentY: touch.clientY,
        };
      }
      // Right side = kick
      else {
        touchKickRef.current = { active: false, startTime: Date.now() };
        startKickCharge();
      }
    };
    
    const onTouchMove = (e) => {
      if (touchJoystickRef.current.active) {
        const touch = e.touches[0];
        touchJoystickRef.current.currentX = touch.clientX;
        touchJoystickRef.current.currentY = touch.clientY;
      }
    };
    
    const onTouchEnd = (e) => {
      touchJoystickRef.current.active = false;
      if (touchKickRef.current.startTime > 0) {
        touchKickRef.current.active = true;
        touchKickRef.current.startTime = 0;
      }
    };
    
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobile, currentScene, startKickCharge]);
  
  // Resize handler
  useEffect(() => {
    const onResize = () => {
      if (!appRef.current) return;
      
      appRef.current.renderer.resize(window.innerWidth, window.innerHeight);
      
      const scale = getResponsiveScale();
      cameraRef.current.zoom = 1.4 * scale;
    };
    
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [getResponsiveScale]);
  
  if (currentScene !== SCENE_TYPES.FOOTBALL_GROUND) {
    return null;
  }
  
  const playerCount = groundPlayers.size + 1;
  const staminaPercent = localPlayerState?.stamina || 100;
  
  return (
    <div className="absolute inset-0 z-50">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Goal Animation Overlay */}
      <AnimatePresence>
        {isGoalAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-[100] pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-center"
            >
              <motion.div 
                className="text-8xl mb-4"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                ⚽
              </motion.div>
              <motion.h1 
                className="text-7xl font-black tracking-wider"
                style={{ 
                  color: lastGoalBy === 'red' ? '#EF4444' : '#3B82F6',
                  textShadow: `0 0 40px ${lastGoalBy === 'red' ? '#EF4444' : '#3B82F6'}`,
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, repeat: 5 }}
              >
                GOAL!
              </motion.h1>
              <motion.p 
                className="text-3xl text-white mt-4 font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {lastGoalBy === 'red' ? 'Red' : 'Blue'} Team Scores!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* HUD - Score Board */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          className="flex items-center gap-8 px-10 py-4 rounded-2xl backdrop-blur-md"
          style={{ 
            background: 'rgba(0, 0, 0, 0.90)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* Blue Team */}
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-3xl shadow-lg"
              style={{ background: '#3B82F6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.7)' }}
              animate={lastGoalBy === 'blue' ? { scale: [1, 1.3, 1] } : {}}
            >
              {score.blue}
            </motion.div>
            <span className="text-blue-300 font-bold text-base uppercase tracking-wider">Blue</span>
          </div>
          
          <div className="text-gray-400 font-bold text-2xl">—</div>
          
          {/* Red Team */}
          <div className="flex items-center gap-4">
            <span className="text-red-300 font-bold text-base uppercase tracking-wider">Red</span>
            <motion.div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-3xl shadow-lg"
              style={{ background: '#EF4444', boxShadow: '0 0 20px rgba(239, 68, 68, 0.7)' }}
              animate={lastGoalBy === 'red' ? { scale: [1, 1.3, 1] } : {}}
            >
              {score.red}
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Player count - Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <div 
          className="flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-md"
          style={{ 
            background: 'rgba(0, 0, 0, 0.80)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <FiUsers className="text-green-400 text-lg" />
          <span className="text-white font-semibold">{playerCount}</span>
          <div 
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ background: isConnected ? '#22C55E' : '#EF4444' }}
          />
        </div>
      </div>
      
      {/* Stamina Bar - Top Right, Below Player Count */}
      <div className="absolute top-24 right-6 z-50">
        <div 
          className="w-40 px-4 py-3 rounded-xl backdrop-blur-md"
          style={{ 
            background: 'rgba(0, 0, 0, 0.80)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FiZap className="text-yellow-400 text-base" />
            <span className="text-white text-sm font-semibold">Stamina</span>
          </div>
          <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                background: staminaPercent > 30 
                  ? 'linear-gradient(90deg, #22C55E, #84CC16)' 
                  : 'linear-gradient(90deg, #EF4444, #F59E0B)',
                width: `${staminaPercent}%`,
              }}
              initial={false}
              animate={{ width: `${staminaPercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-xs text-gray-400 mt-1">{Math.round(staminaPercent)}%</span>
        </div>
      </div>
      
      {/* Kick Power Indicator */}
      <AnimatePresence>
        {kickChargePercent > 0 && (
          <motion.div 
            className="absolute top-48 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div 
              className="w-40 px-4 py-3 rounded-xl backdrop-blur-md"
              style={{ 
                background: 'rgba(0, 0, 0, 0.80)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FiTarget className="text-orange-400 text-base" />
                <span className="text-white text-sm font-semibold">Kick Power</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, #F59E0B, #EF4444)`,
                    width: `${kickChargePercent}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1">{Math.round(kickChargePercent)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Controls Help */}
      <AnimatePresence>
        {showControls && !isMobile && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute bottom-8 left-6 z-50 max-w-xs"
          >
            <div 
              className="px-5 py-4 rounded-xl backdrop-blur-md"
              style={{ 
                background: 'rgba(0, 0, 0, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              <h3 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">⌨️ Controls</h3>
              <div className="space-y-2 text-gray-300 text-xs font-medium">
                <p><kbd className="px-2 py-1 bg-white/15 rounded text-xs font-semibold">WASD</kbd> <span className="ml-2">Move</span></p>
                <p><kbd className="px-2 py-1 bg-white/15 rounded text-xs font-semibold">SHIFT</kbd> <span className="ml-2">Sprint (Uses Stamina)</span></p>
                <p><kbd className="px-2 py-1 bg-white/15 rounded text-xs font-semibold">SPACE</kbd> <span className="ml-2">Kick (Hold to charge)</span></p>
                <p><kbd className="px-2 py-1 bg-white/15 rounded text-xs font-semibold">H</kbd> <span className="ml-2">Toggle Help</span></p>
                <p><kbd className="px-2 py-1 bg-white/15 rounded text-xs font-semibold">ESC</kbd> <span className="ml-2">Exit Game</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Controls Hint */}
      {isMobile && (
        <div className="absolute bottom-24 left-4 right-4 z-50 flex justify-between px-4">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px dashed rgba(255, 255, 255, 0.3)',
            }}
          >
            <span className="text-white/50 text-xs">MOVE</span>
          </div>
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ 
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
            }}
          >
            <span className="text-red-400 text-xs font-bold">KICK</span>
          </div>
        </div>
      )}
      
      {/* Team indicator */}
      {localPlayer && (
        <div className="absolute top-4 left-4 z-50">
          <div 
            className="px-4 py-2 rounded-xl backdrop-blur-md"
            style={{ 
              background: localPlayer.team === 'red' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              border: `2px solid ${localPlayer.team === 'red' ? '#EF4444' : '#3B82F6'}`,
              boxShadow: `0 0 15px ${localPlayer.team === 'red' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            }}
          >
            <span 
              className="font-bold text-sm uppercase tracking-wide"
              style={{ color: localPlayer.team === 'red' ? '#EF4444' : '#3B82F6' }}
            >
              Team {localPlayer.team}
            </span>
          </div>
        </div>
      )}
      
      {/* Exit prompt */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div 
          className="px-6 py-3 rounded-xl backdrop-blur-md border shadow-lg"
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            fontSize: 'clamp(0.75rem, 1.2vw, 1rem)',
          }}
        >
          <span className="text-white font-medium">
            Press <kbd className="px-2 py-1 mx-1 bg-white/20 rounded text-sm font-bold">ESC</kbd> to Exit
          </span>
        </div>
      </div>
    </div>
  );
};

export default FootballGroundScene;
