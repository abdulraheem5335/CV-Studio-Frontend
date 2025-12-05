/**
 * Football Store - Enhanced Realistic Multiplayer Football State Management
 * 
 * Features:
 * - Stamina system with sprint
 * - Variable kick power (tap vs hold)
 * - Player stats tracking
 * - Match state management
 * - Camera shake effects
 * - Optimized for real-time sync
 */

import { create } from 'zustand';

// Enhanced configuration
const CONFIG = {
  // Network sync rates
  POSITION_SYNC_RATE: 33,        // ~30 FPS
  INTERPOLATION_FACTOR: 0.2,    // Smooth remote player movement
  
  // Ball physics
  BALL_FRICTION: 0.985,          // Higher = less friction (grass feel)
  BALL_KICK_POWER_MIN: 5,        // Minimum kick (tap)
  BALL_KICK_POWER_MAX: 18,       // Maximum kick (charged)
  BALL_MAX_SPEED: 20,
  KICK_DISTANCE: 45,             // Must be within this to kick
  KICK_CHARGE_RATE: 15,          // Power per second of hold
  KICK_COOLDOWN: 300,            // ms between kicks
  
  // Player movement
  PLAYER_BASE_SPEED: 0.8,        // Base max speed (reduced for interactivity)
  PLAYER_SPRINT_SPEED: 1.3,      // Sprint max speed (reduced)
  PLAYER_ACCELERATION: 0.05,     // How fast to reach max speed (slower)
  PLAYER_FRICTION: 0.90,         // Deceleration when not moving
  PLAYER_TURNING_SPEED: 0.12,    // How fast direction changes
  
  // Ball-player collision
  PLAYER_RADIUS: 15,             // For collision detection
  BALL_PLAYER_MOMENTUM_TRANSFER: 0.6, // How much player momentum transfers to ball
  
  // Stamina system
  STAMINA_MAX: 100,
  STAMINA_DRAIN_RATE: 25,        // Per second while sprinting
  STAMINA_REGEN_RATE: 15,        // Per second when not sprinting
  STAMINA_REGEN_DELAY: 1000,     // ms before regen starts
  STAMINA_MIN_TO_SPRINT: 10,     // Minimum stamina to start sprinting
  
  // Field dimensions
  FIELD: {
    width: 800,
    height: 600,
    padding: 50,
    goalWidth: 80,
    goalDepth: 25,
    centerCircleRadius: 50,
  },
  
  // Team colors
  TEAM_COLORS: {
    red: { primary: 0xEF4444, secondary: 0xFCA5A5, glow: '#EF4444' },
    blue: { primary: 0x3B82F6, secondary: 0x93C5FD, glow: '#3B82F6' },
  },
  
  // Match settings
  MATCH_DURATION: 300,           // 5 minutes in seconds
  GOAL_CELEBRATION_TIME: 3000,   // ms
  COUNTDOWN_TIME: 3,             // seconds before restart
};

// Initial ball state
const INITIAL_BALL = {
  x: CONFIG.FIELD.width / 2,
  y: CONFIG.FIELD.height / 2,
  vx: 0,
  vy: 0,
  spin: 0,                       // Ball spin for curve
  height: 0,                     // For aerial kicks (future)
  lastKickedBy: null,
  lastKickTime: 0,
};

// Initial player state
const INITIAL_PLAYER_STATE = {
  stamina: CONFIG.STAMINA_MAX,
  isSprinting: false,
  kickChargeStart: null,
  kickCooldown: 0,
  lastStaminaUse: 0,
  stats: {
    goals: 0,
    assists: 0,
    kicks: 0,
    distance: 0,
  },
};

const useFootballStore = create((set, get) => ({
  // Connection state
  isInGround: false,
  isConnected: false,
  
  // Players
  groundPlayers: new Map(),      // socketId -> player data
  localPlayer: null,             // Local player data
  localPlayerState: { ...INITIAL_PLAYER_STATE },
  
  // Ball
  ball: { ...INITIAL_BALL },
  ballServerState: { ...INITIAL_BALL },
  
  // Match state
  score: { red: 0, blue: 0 },
  matchTime: CONFIG.MATCH_DURATION,
  matchPhase: 'waiting',         // waiting, countdown, playing, goalCelebration, halftime, ended
  
  // UI state
  lastGoalBy: null,
  lastGoalScorer: null,
  isGoalAnimation: false,
  isPlaying: false,
  countdown: null,
  
  // Camera effects
  cameraShake: { intensity: 0, duration: 0 },
  
  // Sync timing
  lastSyncTime: 0,
  
  // Config export
  CONFIG,
  
  // ============================================
  // ACTIONS
  // ============================================
  
  // Enter football ground
  enterGround: (socket, user, position) => {
    if (!socket || !socket.connected) return;
    
    // Determine team based on current balance
    const { groundPlayers } = get();
    let redCount = 0, blueCount = 0;
    groundPlayers.forEach(p => {
      if (p.team === 'red') redCount++;
      else blueCount++;
    });
    const team = redCount <= blueCount ? 'red' : 'blue';
    
    // Spawn position based on team
    const spawnX = team === 'red' 
      ? CONFIG.FIELD.width * 0.25 
      : CONFIG.FIELD.width * 0.75;
    const spawnY = CONFIG.FIELD.height / 2 + (Math.random() - 0.5) * 100;
    
    socket.emit('football:join', {
      odId: user?.odId || user?._id,
      odname: user?.nickname || user?.name || 'Player',
      avatar: user?.avatar,
      team,
      position: { x: spawnX, y: spawnY },
    });
    
    set({
      isInGround: true,
      isConnected: true,
      localPlayer: {
        odId: user?.odId || user?._id,
        nickname: user?.nickname || user?.name || 'Player',
        avatar: user?.avatar,
        team,
        x: spawnX,
        y: spawnY,
      },
      localPlayerState: { ...INITIAL_PLAYER_STATE },
      isPlaying: true,
    });
    
    console.log('[Football] Joined ground as:', team);
  },
  
  // Leave football ground
  leaveGround: (socket) => {
    if (socket && socket.connected) {
      socket.emit('football:leave');
    }
    
    set({
      isInGround: false,
      isConnected: false,
      groundPlayers: new Map(),
      localPlayer: null,
      localPlayerState: { ...INITIAL_PLAYER_STATE },
      ball: { ...INITIAL_BALL },
      score: { red: 0, blue: 0 },
      matchPhase: 'waiting',
      isPlaying: false,
    });
    
    console.log('[Football] Left ground');
  },
  
  // Update local player position (send to server)
  updatePosition: (socket, position, velocity) => {
    const now = Date.now();
    const { lastSyncTime } = get();
    
    // Throttle updates
    if (now - lastSyncTime < CONFIG.POSITION_SYNC_RATE) return;
    
    if (socket && socket.connected) {
      socket.emit('football:position', { 
        x: position.x, 
        y: position.y,
        vx: velocity.x,
        vy: velocity.y,
      });
    }
    
    set({ lastSyncTime: now });
  },
  
  // Stamina management
  updateStamina: (delta, isSprinting) => {
    const { localPlayerState } = get();
    const now = Date.now();
    
    let newStamina = localPlayerState.stamina;
    let canSprint = localPlayerState.stamina >= CONFIG.STAMINA_MIN_TO_SPRINT;
    
    if (isSprinting && canSprint) {
      // Drain stamina
      newStamina -= (CONFIG.STAMINA_DRAIN_RATE * delta) / 1000;
      set(state => ({
        localPlayerState: {
          ...state.localPlayerState,
          stamina: Math.max(0, newStamina),
          isSprinting: true,
          lastStaminaUse: now,
        }
      }));
    } else {
      // Regenerate stamina after delay
      const timeSinceUse = now - localPlayerState.lastStaminaUse;
      if (timeSinceUse >= CONFIG.STAMINA_REGEN_DELAY) {
        newStamina += (CONFIG.STAMINA_REGEN_RATE * delta) / 1000;
        set(state => ({
          localPlayerState: {
            ...state.localPlayerState,
            stamina: Math.min(CONFIG.STAMINA_MAX, newStamina),
            isSprinting: false,
          }
        }));
      } else {
        set(state => ({
          localPlayerState: {
            ...state.localPlayerState,
            isSprinting: false,
          }
        }));
      }
    }
    
    return canSprint && isSprinting;
  },
  
  // Start charging kick
  startKickCharge: () => {
    const { localPlayerState, isPlaying } = get();
    if (!isPlaying) return;
    
    const now = Date.now();
    if (now < localPlayerState.kickCooldown) return;
    
    set(state => ({
      localPlayerState: {
        ...state.localPlayerState,
        kickChargeStart: now,
      }
    }));
  },
  
  // Execute kick with charge power
  executeKick: (socket, playerPos, direction) => {
    const { ball, isPlaying, localPlayerState } = get();
    if (!isPlaying) return false;
    
    const now = Date.now();
    
    // Check cooldown
    if (now < localPlayerState.kickCooldown) return false;
    
    // Check if player is close enough to ball
    const dx = ball.x - playerPos.x;
    const dy = ball.y - playerPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > CONFIG.KICK_DISTANCE) {
      set(state => ({
        localPlayerState: {
          ...state.localPlayerState,
          kickChargeStart: null,
        }
      }));
      return false;
    }
    
    // Calculate kick power based on charge time
    let kickPower = CONFIG.BALL_KICK_POWER_MIN;
    if (localPlayerState.kickChargeStart) {
      const chargeTime = (now - localPlayerState.kickChargeStart) / 1000;
      kickPower = Math.min(
        CONFIG.BALL_KICK_POWER_MAX,
        CONFIG.BALL_KICK_POWER_MIN + chargeTime * CONFIG.KICK_CHARGE_RATE
      );
    }
    
    // Normalize direction and apply kick power
    const len = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (len === 0) return false;
    
    const kickVx = (direction.x / len) * kickPower;
    const kickVy = (direction.y / len) * kickPower;
    
    // Add slight curve based on player velocity (spin effect)
    const spin = (Math.random() - 0.5) * 0.3;
    
    // Emit kick to server
    if (socket && socket.connected) {
      socket.emit('football:kick', {
        vx: kickVx,
        vy: kickVy,
        power: kickPower,
        spin,
      });
    }
    
    // Optimistic local update
    set(state => ({
      ball: {
        ...state.ball,
        vx: kickVx,
        vy: kickVy,
        spin,
        lastKickedBy: socket?.id,
        lastKickTime: now,
      },
      localPlayerState: {
        ...state.localPlayerState,
        kickChargeStart: null,
        kickCooldown: now + CONFIG.KICK_COOLDOWN,
        stats: {
          ...state.localPlayerState.stats,
          kicks: state.localPlayerState.stats.kicks + 1,
        }
      },
      // Add camera shake on powerful kicks
      cameraShake: kickPower > 12 ? { intensity: kickPower * 0.3, duration: 200 } : state.cameraShake,
    }));
    
    return true;
  },
  
  // Get current kick charge percentage
  getKickChargePercent: () => {
    const { localPlayerState } = get();
    if (!localPlayerState.kickChargeStart) return 0;
    
    const chargeTime = (Date.now() - localPlayerState.kickChargeStart) / 1000;
    const power = CONFIG.BALL_KICK_POWER_MIN + chargeTime * CONFIG.KICK_CHARGE_RATE;
    return Math.min(100, ((power - CONFIG.BALL_KICK_POWER_MIN) / 
      (CONFIG.BALL_KICK_POWER_MAX - CONFIG.BALL_KICK_POWER_MIN)) * 100);
  },
  
  // Update camera shake
  updateCameraShake: (delta) => {
    set(state => {
      if (state.cameraShake.duration <= 0) return state;
      return {
        cameraShake: {
          intensity: state.cameraShake.intensity * 0.9,
          duration: state.cameraShake.duration - delta,
        }
      };
    });
  },
  
  // Trigger camera shake
  triggerCameraShake: (intensity, duration) => {
    set({ cameraShake: { intensity, duration } });
  },
  
  // Interpolate remote player positions
  interpolateRemotePlayers: () => {
    set(state => {
      const updated = new Map(state.groundPlayers);
      
      updated.forEach((player, id) => {
        if (player.targetPosition) {
          player.position.x += (player.targetPosition.x - player.position.x) * CONFIG.INTERPOLATION_FACTOR;
          player.position.y += (player.targetPosition.y - player.position.y) * CONFIG.INTERPOLATION_FACTOR;
        }
      });
      
      return { groundPlayers: updated };
    });
  },
  
  // ============================================
  // SOCKET EVENT HANDLERS
  // ============================================
  
  handlePlayerJoined: (playerData) => {
    set(state => {
      const updated = new Map(state.groundPlayers);
      updated.set(playerData.socketId, {
        ...playerData,
        position: { x: playerData.x || 400, y: playerData.y || 300 },
        targetPosition: { x: playerData.x || 400, y: playerData.y || 300 },
        velocity: { x: 0, y: 0 },
      });
      return { groundPlayers: updated };
    });
    console.log('[Football] Player joined:', playerData.nickname);
  },
  
  handlePlayerLeft: (socketId) => {
    set(state => {
      const updated = new Map(state.groundPlayers);
      updated.delete(socketId);
      return { groundPlayers: updated };
    });
    console.log('[Football] Player left:', socketId);
  },
  
  handlePlayerMoved: (data) => {
    set(state => {
      const updated = new Map(state.groundPlayers);
      const player = updated.get(data.socketId);
      
      if (player) {
        player.targetPosition = { x: data.x, y: data.y };
        player.velocity = { x: data.vx || 0, y: data.vy || 0 };
        updated.set(data.socketId, player);
      }
      
      return { groundPlayers: updated };
    });
  },
  
  handlePlayersList: (players) => {
    const playersMap = new Map();
    players.forEach(p => {
      playersMap.set(p.socketId, {
        ...p,
        position: { x: p.x || 400, y: p.y || 300 },
        targetPosition: { x: p.x || 400, y: p.y || 300 },
        velocity: { x: 0, y: 0 },
      });
    });
    set({ groundPlayers: playersMap });
  },
  
  handleBallUpdate: (ballState) => {
    set(state => ({
      ball: {
        x: ballState.x,
        y: ballState.y,
        vx: ballState.vx,
        vy: ballState.vy,
        spin: ballState.spin || 0,
        lastKickedBy: ballState.lastKickedBy,
      },
      ballServerState: { ...ballState },
    }));
  },
  
  handleGoalScored: (data) => {
    set(state => ({
      score: data.score,
      lastGoalBy: data.team,
      lastGoalScorer: data.scoredBy,
      isGoalAnimation: true,
      isPlaying: false,
      matchPhase: 'goalCelebration',
      cameraShake: { intensity: 15, duration: 500 },
      // Update local stats if we scored
      localPlayerState: data.scoredBy === state.localPlayer?.odId 
        ? {
            ...state.localPlayerState,
            stats: {
              ...state.localPlayerState.stats,
              goals: state.localPlayerState.stats.goals + 1,
            }
          }
        : state.localPlayerState,
    }));
    
    console.log('[Football] GOAL! Team:', data.team, 'Score:', data.score);
    
    // Reset after animation
    setTimeout(() => {
      set({
        ball: { ...INITIAL_BALL },
        isGoalAnimation: false,
        isPlaying: true,
        matchPhase: 'playing',
        lastGoalBy: null,
        lastGoalScorer: null,
      });
    }, CONFIG.GOAL_CELEBRATION_TIME);
  },
  
  handleGameState: (state) => {
    set({
      ball: state.ball || { ...INITIAL_BALL },
      score: state.score || { red: 0, blue: 0 },
      isPlaying: state.isPlaying !== false,
      matchPhase: state.isPlaying ? 'playing' : 'waiting',
      matchTime: state.matchTime || CONFIG.MATCH_DURATION,
    });
  },
  
  // Reset store
  reset: () => {
    set({
      isInGround: false,
      isConnected: false,
      groundPlayers: new Map(),
      localPlayer: null,
      localPlayerState: { ...INITIAL_PLAYER_STATE },
      ball: { ...INITIAL_BALL },
      ballServerState: { ...INITIAL_BALL },
      score: { red: 0, blue: 0 },
      matchTime: CONFIG.MATCH_DURATION,
      matchPhase: 'waiting',
      lastGoalBy: null,
      lastGoalScorer: null,
      isGoalAnimation: false,
      isPlaying: false,
      countdown: null,
      cameraShake: { intensity: 0, duration: 0 },
      lastSyncTime: 0,
    });
  },
}));

export default useFootballStore;
export { CONFIG as FOOTBALL_CONFIG };
