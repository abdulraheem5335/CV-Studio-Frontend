/**
 * Chat Store - Zustand store for proximity chat
 * 
 * Manages:
 * - Socket connection
 * - Nearby players
 * - Chat messages
 * - Chat UI state
 */

import { create } from 'zustand';
import { io } from 'socket.io-client';

// Socket.io connects to root, not /api
const SOCKET_URL = 'http://localhost:5000';

const useChatStore = create((set, get) => ({
  // Connection state
  socket: null,
  isConnected: false,
  isConnecting: false,
  connectionError: null,

  // Players state
  nearbyPlayers: new Map(),
  allPlayers: new Map(),

  // Chat state
  messages: [],
  chatBubbles: [], // For Pixi rendering
  isChatOpen: false,
  isChatEnabled: true,
  unreadCount: 0,

  // Configuration
  config: {
    proximityThreshold: 200,
    bubbleDuration: 5000,
    maxMessages: 50,
    positionUpdateRate: 50, // ms
  },

  // Initialize socket connection
  connect: (user) => {
    const { socket, isConnecting } = get();
    
    // Prevent duplicate connections
    if (socket || isConnecting) {
      console.log('[Chat] Already connected or connecting, skipping');
      return;
    }

    console.log('[Chat] Connecting to:', SOCKET_URL);
    set({ isConnecting: true });
    
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: false, // Reuse existing connection
    });
    
    // Store socket immediately to prevent duplicate calls
    set({ socket: newSocket });

    newSocket.on('connect', () => {
      console.log('[Chat] Connected to server, socket id:', newSocket.id);
      set({ isConnected: true, connectionError: null, isConnecting: false });

      // Join with user data
      newSocket.emit('player:join', {
        userId: user?._id || 'guest-' + Date.now(),
        nickname: user?.nickname || 'Explorer',
        avatar: user?.avatar || { color: '#3B82F6' },
        x: 1150,
        y: 500,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('[Chat] Disconnected from server');
      set({ isConnected: false, isConnecting: false });
    });

    newSocket.on('connect_error', (error) => {
      console.error('[Chat] Connection error:', error);
      set({ connectionError: error.message, isConnected: false, isConnecting: false });
    });

    // Handle other players (server already filters out self, but double-check)
    newSocket.on('players:list', (players) => {
      const playersMap = new Map();
      players.forEach(p => {
        if (p.socketId !== newSocket.id) {
          playersMap.set(p.socketId, p);
        }
      });
      set({ allPlayers: playersMap });
    });

    newSocket.on('player:joined', (player) => {
      // Don't add self to allPlayers
      if (player.socketId === newSocket.id) return;
      
      set(state => {
        const updated = new Map(state.allPlayers);
        updated.set(player.socketId, player);
        return { allPlayers: updated };
      });
    });

    newSocket.on('player:moved', (data) => {
      // Don't track self movement
      if (data.socketId === newSocket.id) return;
      
      set(state => {
        const updated = new Map(state.allPlayers);
        let player = updated.get(data.socketId);
        if (player) {
          player.x = data.x;
          player.y = data.y;
          updated.set(data.socketId, player);
        } else {
          // Player not in list yet, add them
          updated.set(data.socketId, {
            socketId: data.socketId,
            x: data.x,
            y: data.y,
            nickname: 'Player',
            avatar: { color: '#6B7280' },
          });
        }
        return { allPlayers: updated };
      });
    });

    // Handle nearby players list (for chat eligibility)
    // Filter out self just in case server sends it
    newSocket.on('players:nearby', (nearbyList) => {
      const filtered = nearbyList.filter(p => p.socketId !== newSocket.id);
      set({ nearbyPlayers: new Map(filtered.map(p => [p.socketId, p])) });
    });

    newSocket.on('player:left', (data) => {
      set(state => {
        const updated = new Map(state.allPlayers);
        updated.delete(data.socketId);
        return { allPlayers: updated };
      });
    });

    // Handle chat messages
    newSocket.on('chat:received', (message) => {
      const { isChatOpen, config } = get();
      
      set(state => {
        // Add to messages list
        const messages = [...state.messages, message].slice(-config.maxMessages);
        
        // Add chat bubble for Pixi rendering
        const bubble = {
          ...message,
          expiresAt: Date.now() + config.bubbleDuration,
        };
        const chatBubbles = [...state.chatBubbles, bubble];
        
        // Update unread count
        const unreadCount = isChatOpen ? 0 : state.unreadCount + 1;
        
        return { messages, chatBubbles, unreadCount };
      });
    });

    newSocket.on('chat:error', (data) => {
      console.warn('[Chat] Error:', data.message);
    });

    newSocket.on('connection:timeout', () => {
      console.warn('[Chat] Connection timed out');
      get().disconnect();
    });

    // Socket is already stored at the top, no need to set again
  },

  // Disconnect socket
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('player:leave');
      socket.disconnect();
    }
    set({ 
      socket: null, 
      isConnected: false, 
      isConnecting: false,
      allPlayers: new Map(),
      nearbyPlayers: new Map(),
      messages: [],
      chatBubbles: [],
    });
  },

  // Update player position
  updatePosition: (x, y) => {
    const { socket, isConnected } = get();
    if (!socket || !isConnected) return;
    socket.emit('player:position', { x, y });
  },

  // Send chat message
  sendMessage: (message) => {
    const { socket, isConnected, isChatEnabled } = get();
    if (!socket || !isConnected || !isChatEnabled) return false;
    
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > 200) return false;
    
    socket.emit('chat:message', { message: trimmed });
    return true;
  },

  // Update nearby players (client-side calculation for UI)
  updateNearbyPlayers: (myX, myY) => {
    const { allPlayers, config } = get();
    const thresholdSq = config.proximityThreshold * config.proximityThreshold;
    const nearby = new Map();
    
    allPlayers.forEach((player, socketId) => {
      const dx = myX - player.x;
      const dy = myY - player.y;
      const distSq = dx * dx + dy * dy;
      
      if (distSq <= thresholdSq) {
        nearby.set(socketId, { ...player, distance: Math.sqrt(distSq) });
      }
    });
    
    set({ nearbyPlayers: nearby });
  },

  // Clean expired chat bubbles
  cleanExpiredBubbles: () => {
    const now = Date.now();
    set(state => ({
      chatBubbles: state.chatBubbles.filter(b => b.expiresAt > now),
    }));
  },

  // Toggle chat panel
  toggleChat: () => {
    set(state => ({ 
      isChatOpen: !state.isChatOpen,
      unreadCount: state.isChatOpen ? state.unreadCount : 0,
    }));
  },

  // Toggle chat enabled
  toggleChatEnabled: () => {
    set(state => ({ isChatEnabled: !state.isChatEnabled }));
  },

  // Clear messages
  clearMessages: () => {
    set({ messages: [], chatBubbles: [], unreadCount: 0 });
  },
}));

export { useChatStore };
export default useChatStore;
