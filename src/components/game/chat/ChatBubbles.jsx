import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Color } from 'pixi.js';
import { useChatStore } from '../../../store/chatStore';
import { useTheme } from '../../ui/ThemeProvider';

// Helper function to convert hex string to number (replacing deprecated PIXI.utils.string2hex)
const string2hex = (str) => {
  if (typeof str === 'number') return str;
  return new Color(str).toNumber();
};

// Constants for chat bubbles
const BUBBLE_CONFIG = {
  maxWidth: 150,
  padding: 8,
  borderRadius: 12,
  fontSize: 11,
  fontFamily: 'Arial, sans-serif',
  duration: 4000, // How long bubbles stay visible (ms)
  fadeOutDuration: 500,
  offsetY: -50, // Position above player
  tailHeight: 8,
};

/**
 * Manages chat bubbles in the Pixi.js canvas
 * This component doesn't render anything - it manipulates the Pixi container directly
 */
export const ChatBubblesManager = ({ container, playerPositions, cameraOffset }) => {
  const { recentBubbles } = useChatStore();
  const { colors } = useTheme();
  const bubblesRef = useRef(new Map()); // Map<odId, { graphics, text, timestamp }>

  useEffect(() => {
    if (!container) return;

    const now = Date.now();
    const currentBubbles = bubblesRef.current;

    // Add new bubbles
    recentBubbles.forEach((bubble) => {
      if (!currentBubbles.has(bubble.odId)) {
        const bubbleContainer = createBubble(bubble, colors);
        container.addChild(bubbleContainer);
        currentBubbles.set(bubble.odId, {
          container: bubbleContainer,
          timestamp: now,
          playerId: bubble.playerId,
        });
      }
    });

    // Update positions and remove expired bubbles
    currentBubbles.forEach((data, odId) => {
      const elapsed = now - data.timestamp;
      
      if (elapsed > BUBBLE_CONFIG.duration) {
        // Remove expired bubble
        container.removeChild(data.container);
        data.container.destroy({ children: true });
        currentBubbles.delete(odId);
      } else {
        // Update position based on player position
        const playerPos = playerPositions[data.playerId];
        if (playerPos) {
          data.container.x = playerPos.x - cameraOffset.x;
          data.container.y = playerPos.y - cameraOffset.y + BUBBLE_CONFIG.offsetY;
        }

        // Fade out near the end
        if (elapsed > BUBBLE_CONFIG.duration - BUBBLE_CONFIG.fadeOutDuration) {
          const fadeProgress = (elapsed - (BUBBLE_CONFIG.duration - BUBBLE_CONFIG.fadeOutDuration)) / BUBBLE_CONFIG.fadeOutDuration;
          data.container.alpha = 1 - fadeProgress;
        }
      }
    });
  }, [container, recentBubbles, playerPositions, cameraOffset, colors]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      bubblesRef.current.forEach((data) => {
        data.container.destroy({ children: true });
      });
      bubblesRef.current.clear();
    };
  }, []);

  return null; // This component doesn't render anything
};

/**
 * Creates a Pixi.js chat bubble
 */
function createBubble(bubble, colors) {
  const container = new PIXI.Container();
  container.sortableChildren = true;

  // Measure text to determine bubble size
  const style = new PIXI.TextStyle({
    fontFamily: BUBBLE_CONFIG.fontFamily,
    fontSize: BUBBLE_CONFIG.fontSize,
    fill: colors.text || '#1F2937',
    wordWrap: true,
    wordWrapWidth: BUBBLE_CONFIG.maxWidth - BUBBLE_CONFIG.padding * 2,
  });

  const text = new PIXI.Text(bubble.text, style);
  const textWidth = Math.min(text.width, BUBBLE_CONFIG.maxWidth - BUBBLE_CONFIG.padding * 2);
  const textHeight = text.height;

  const bubbleWidth = textWidth + BUBBLE_CONFIG.padding * 2;
  const bubbleHeight = textHeight + BUBBLE_CONFIG.padding * 2;

  // Draw bubble background
  const graphics = new PIXI.Graphics();
  const bgColor = string2hex(colors.surface || '#FFFFFF');
  const borderColor = string2hex(colors.border || '#E5E7EB');

  // Main bubble body with rounded corners
  graphics.beginFill(bgColor, 0.95);
  graphics.lineStyle(1, borderColor, 0.8);
  graphics.drawRoundedRect(
    -bubbleWidth / 2,
    -bubbleHeight - BUBBLE_CONFIG.tailHeight,
    bubbleWidth,
    bubbleHeight,
    BUBBLE_CONFIG.borderRadius
  );
  graphics.endFill();

  // Tail pointing down
  graphics.beginFill(bgColor, 0.95);
  graphics.lineStyle(0);
  graphics.moveTo(-6, -BUBBLE_CONFIG.tailHeight);
  graphics.lineTo(0, 0);
  graphics.lineTo(6, -BUBBLE_CONFIG.tailHeight);
  graphics.closePath();
  graphics.endFill();

  // Add border for tail
  graphics.lineStyle(1, borderColor, 0.8);
  graphics.moveTo(-6, -BUBBLE_CONFIG.tailHeight);
  graphics.lineTo(0, 0);
  graphics.lineTo(6, -BUBBLE_CONFIG.tailHeight);

  container.addChild(graphics);

  // Position text centered in bubble
  text.anchor.set(0.5, 0.5);
  text.x = 0;
  text.y = -bubbleHeight / 2 - BUBBLE_CONFIG.tailHeight;
  text.zIndex = 1;
  container.addChild(text);

  // Add nickname label above bubble
  const nicknameStyle = new PIXI.TextStyle({
    fontFamily: BUBBLE_CONFIG.fontFamily,
    fontSize: 9,
    fill: colors.textMuted || '#6B7280',
    fontWeight: 'bold',
  });
  const nickname = new PIXI.Text(bubble.nickname, nicknameStyle);
  nickname.anchor.set(0.5, 1);
  nickname.x = 0;
  nickname.y = -bubbleHeight - BUBBLE_CONFIG.tailHeight - 4;
  container.addChild(nickname);

  return container;
}

/**
 * Hook to manage chat bubble state for integration with PixiCampusMap
 */
export const useChatBubbles = () => {
  const { recentBubbles, nearbyPlayers } = useChatStore();
  
  // Get positions of nearby players for bubble rendering
  const playerPositions = {};
  Object.values(nearbyPlayers).forEach((player) => {
    playerPositions[player.odId] = { x: player.x, y: player.y };
  });

  return {
    recentBubbles,
    playerPositions,
  };
};

export default ChatBubblesManager;
