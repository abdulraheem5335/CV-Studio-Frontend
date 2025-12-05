/**
 * Icon Renderer - Replaces emojis with professional vector graphics
 * All icons are drawn using Pixi.js Graphics for crisp, scalable visuals
 */

import { Graphics, Container } from 'pixi.js';

/**
 * Building type icons - Professional vector graphics
 */
export const BUILDING_ICONS = {
  // Academic - Computer/Monitor icon
  academic: (g, size = 20, color = 0xFFFFFF) => {
    g.rect(-size * 0.6, -size * 0.4, size * 1.2, size * 0.7);
    g.fill({ color, alpha: 0.9 });
    g.stroke({ width: 1.5, color: 0x000000, alpha: 0.3 });
    // Screen
    g.rect(-size * 0.5, -size * 0.3, size * 1.0, size * 0.5);
    g.fill({ color: 0x1E3A8A, alpha: 0.8 });
    // Stand
    g.rect(-size * 0.1, size * 0.3, size * 0.2, size * 0.15);
    g.fill({ color, alpha: 0.9 });
    g.rect(-size * 0.25, size * 0.45, size * 0.5, size * 0.06);
    g.fill({ color, alpha: 0.9 });
  },

  // Hostel - Bed icon
  hostel_girls: (g, size = 20, color = 0xF472B6) => {
    // Bed frame
    g.roundRect(-size * 0.6, -size * 0.1, size * 1.2, size * 0.5, 3);
    g.fill({ color, alpha: 0.9 });
    // Pillow
    g.roundRect(-size * 0.5, -size * 0.25, size * 0.35, size * 0.2, 2);
    g.fill({ color: 0xFFFFFF, alpha: 0.9 });
    // Headboard
    g.rect(-size * 0.55, -size * 0.45, size * 0.1, size * 0.35);
    g.fill({ color, alpha: 0.7 });
    // Legs
    g.rect(-size * 0.55, size * 0.35, size * 0.08, size * 0.15);
    g.rect(size * 0.47, size * 0.35, size * 0.08, size * 0.15);
    g.fill({ color: 0x000000, alpha: 0.4 });
  },

  hostel_boys: (g, size = 20, color = 0x60A5FA) => {
    BUILDING_ICONS.hostel_girls(g, size, color);
  },

  // Cafe - Coffee cup
  cafe: (g, size = 20, color = 0x92400E) => {
    // Cup body
    g.moveTo(-size * 0.35, -size * 0.3);
    g.lineTo(-size * 0.25, size * 0.35);
    g.lineTo(size * 0.25, size * 0.35);
    g.lineTo(size * 0.35, -size * 0.3);
    g.closePath();
    g.fill({ color, alpha: 0.9 });
    // Handle
    g.moveTo(size * 0.35, -size * 0.15);
    g.bezierCurveTo(size * 0.55, -size * 0.15, size * 0.55, size * 0.2, size * 0.35, size * 0.2);
    g.stroke({ width: 3, color, alpha: 0.9 });
    // Steam
    g.moveTo(-size * 0.1, -size * 0.4);
    g.bezierCurveTo(-size * 0.15, -size * 0.55, 0, -size * 0.55, 0, -size * 0.45);
    g.moveTo(size * 0.1, -size * 0.4);
    g.bezierCurveTo(size * 0.15, -size * 0.55, size * 0.25, -size * 0.55, size * 0.2, -size * 0.45);
    g.stroke({ width: 1.5, color: 0xFFFFFF, alpha: 0.5 });
  },

  // Mess - Fork and spoon
  mess: (g, size = 20, color = 0xFCD34D) => {
    // Fork
    g.rect(-size * 0.3, -size * 0.4, size * 0.08, size * 0.8);
    g.fill({ color, alpha: 0.9 });
    g.rect(-size * 0.35, -size * 0.4, size * 0.04, size * 0.25);
    g.rect(-size * 0.27, -size * 0.4, size * 0.04, size * 0.25);
    g.rect(-size * 0.19, -size * 0.4, size * 0.04, size * 0.25);
    g.fill({ color, alpha: 0.9 });
    // Spoon
    g.ellipse(size * 0.2, -size * 0.25, size * 0.15, size * 0.2);
    g.fill({ color, alpha: 0.9 });
    g.rect(size * 0.16, -size * 0.05, size * 0.08, size * 0.5);
    g.fill({ color, alpha: 0.9 });
  },

  // Sports - Trophy
  sports: (g, size = 20, color = 0x059669) => {
    // Cup
    g.moveTo(-size * 0.3, -size * 0.35);
    g.lineTo(-size * 0.2, size * 0.1);
    g.lineTo(size * 0.2, size * 0.1);
    g.lineTo(size * 0.3, -size * 0.35);
    g.closePath();
    g.fill({ color: 0xFFD700, alpha: 0.9 });
    // Handles
    g.moveTo(-size * 0.3, -size * 0.25);
    g.bezierCurveTo(-size * 0.5, -size * 0.25, -size * 0.5, size * 0.05, -size * 0.25, size * 0.05);
    g.moveTo(size * 0.3, -size * 0.25);
    g.bezierCurveTo(size * 0.5, -size * 0.25, size * 0.5, size * 0.05, size * 0.25, size * 0.05);
    g.stroke({ width: 3, color: 0xFFD700, alpha: 0.9 });
    // Base
    g.rect(-size * 0.08, size * 0.1, size * 0.16, size * 0.15);
    g.fill({ color: 0xFFD700, alpha: 0.9 });
    g.rect(-size * 0.2, size * 0.25, size * 0.4, size * 0.1);
    g.fill({ color: 0xDAA520, alpha: 0.9 });
  },

  // Library - Book
  landmark: (g, size = 20, color = 0x7C3AED) => {
    // Book cover
    g.roundRect(-size * 0.4, -size * 0.45, size * 0.8, size * 0.9, 2);
    g.fill({ color, alpha: 0.9 });
    // Pages
    g.rect(-size * 0.35, -size * 0.4, size * 0.65, size * 0.8);
    g.fill({ color: 0xFFFBEB, alpha: 0.9 });
    // Spine
    g.rect(-size * 0.4, -size * 0.45, size * 0.1, size * 0.9);
    g.fill({ color, alpha: 0.7 });
    // Lines on pages
    for (let i = 0; i < 3; i++) {
      g.rect(-size * 0.25, -size * 0.25 + i * size * 0.2, size * 0.4, size * 0.04);
      g.fill({ color: 0xD1D5DB, alpha: 0.6 });
    }
  },

  // Gate - Door/Entrance
  gate: (g, size = 20, color = 0x475569) => {
    // Frame
    g.rect(-size * 0.5, -size * 0.5, size * 1.0, size * 0.1);
    g.fill({ color, alpha: 0.9 });
    g.rect(-size * 0.5, -size * 0.5, size * 0.12, size * 1.0);
    g.rect(size * 0.38, -size * 0.5, size * 0.12, size * 1.0);
    g.fill({ color, alpha: 0.9 });
    // Doors
    g.rect(-size * 0.35, -size * 0.35, size * 0.32, size * 0.8);
    g.rect(size * 0.05, -size * 0.35, size * 0.32, size * 0.8);
    g.fill({ color: 0x8B4513, alpha: 0.8 });
    // Handles
    g.circle(-size * 0.1, size * 0.1, size * 0.05);
    g.circle(size * 0.1, size * 0.1, size * 0.05);
    g.fill({ color: 0xFFD700, alpha: 0.9 });
  },
};

/**
 * Minigame icons - Professional vector graphics
 */
export const MINIGAME_ICONS = {
  // Trivia - Question mark in circle
  trivia: (g, size = 16, color = 0xFFFFFF) => {
    g.circle(0, 0, size);
    g.fill({ color: 0x8B5CF6, alpha: 0.9 });
    g.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.4 });
    // Question mark
    g.moveTo(-size * 0.15, -size * 0.3);
    g.bezierCurveTo(-size * 0.15, -size * 0.5, size * 0.25, -size * 0.5, size * 0.2, -size * 0.25);
    g.bezierCurveTo(size * 0.15, -size * 0.1, 0, -size * 0.1, 0, size * 0.05);
    g.stroke({ width: 3, color, alpha: 0.9 });
    g.circle(0, size * 0.3, size * 0.08);
    g.fill({ color, alpha: 0.9 });
  },

  // Memory - Brain/Cards
  memory: (g, size = 16, color = 0xFFFFFF) => {
    g.circle(0, 0, size);
    g.fill({ color: 0xEC4899, alpha: 0.9 });
    g.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.4 });
    // Two cards
    g.roundRect(-size * 0.45, -size * 0.35, size * 0.5, size * 0.7, 2);
    g.fill({ color: 0xFFFFFF, alpha: 0.8 });
    g.roundRect(-size * 0.05, -size * 0.35, size * 0.5, size * 0.7, 2);
    g.fill({ color, alpha: 0.9 });
    g.roundRect(size * 0.05, -size * 0.25, size * 0.3, size * 0.5, 1);
    g.fill({ color: 0xEC4899, alpha: 0.9 });
  },

  // Race - Running figure
  race: (g, size = 16, color = 0xFFFFFF) => {
    g.circle(0, 0, size);
    g.fill({ color: 0x22C55E, alpha: 0.9 });
    g.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.4 });
    // Head
    g.circle(size * 0.05, -size * 0.35, size * 0.15);
    g.fill({ color, alpha: 0.9 });
    // Body
    g.moveTo(size * 0.05, -size * 0.2);
    g.lineTo(-size * 0.1, size * 0.15);
    // Arms
    g.moveTo(-size * 0.05, -size * 0.1);
    g.lineTo(-size * 0.3, -size * 0.25);
    g.moveTo(-size * 0.05, -size * 0.1);
    g.lineTo(size * 0.25, 0);
    // Legs
    g.moveTo(-size * 0.1, size * 0.15);
    g.lineTo(-size * 0.35, size * 0.4);
    g.moveTo(-size * 0.1, size * 0.15);
    g.lineTo(size * 0.15, size * 0.45);
    g.stroke({ width: 2.5, color, alpha: 0.9 });
  },

  // Catch - Target/Crosshair
  catch: (g, size = 16, color = 0xFFFFFF) => {
    g.circle(0, 0, size);
    g.fill({ color: 0xEF4444, alpha: 0.9 });
    g.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.4 });
    // Crosshair
    g.circle(0, 0, size * 0.5);
    g.stroke({ width: 2, color, alpha: 0.8 });
    g.circle(0, 0, size * 0.25);
    g.stroke({ width: 2, color, alpha: 0.8 });
    g.moveTo(-size * 0.6, 0);
    g.lineTo(size * 0.6, 0);
    g.moveTo(0, -size * 0.6);
    g.lineTo(0, size * 0.6);
    g.stroke({ width: 2, color, alpha: 0.8 });
  },
};

/**
 * Collectible icons
 */
export const COLLECTIBLE_ICONS = {
  // Coin - Animated star coin
  coin: (g, size = 10, time = 0) => {
    // Outer ring
    g.circle(0, 0, size);
    g.fill({ color: 0xFACC15, alpha: 0.95 });
    g.stroke({ width: 2, color: 0xCA8A04, alpha: 0.8 });
    // Inner shine
    g.circle(0, 0, size * 0.6);
    g.fill({ color: 0xFDE047, alpha: 0.9 });
    // Star in center
    const starPoints = 5;
    const innerR = size * 0.2;
    const outerR = size * 0.4;
    g.moveTo(0, -outerR);
    for (let i = 0; i < starPoints * 2; i++) {
      const r = i % 2 === 0 ? innerR : outerR;
      const angle = (i * Math.PI) / starPoints - Math.PI / 2;
      g.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    g.closePath();
    g.fill({ color: 0xCA8A04, alpha: 0.7 });
  },

  // XP orb - Glowing experience orb
  xp: (g, size = 12, time = 0) => {
    // Glow
    g.circle(0, 0, size * 1.5);
    g.fill({ color: 0x22D3EE, alpha: 0.2 });
    // Core
    g.circle(0, 0, size);
    g.fill({ color: 0x06B6D4, alpha: 0.9 });
    g.stroke({ width: 2, color: 0x22D3EE, alpha: 0.8 });
    // Inner glow
    g.circle(-size * 0.2, -size * 0.2, size * 0.3);
    g.fill({ color: 0xFFFFFF, alpha: 0.5 });
  },
};

/**
 * Create a building icon container
 */
export const createBuildingIcon = (type, size = 20, themeMode = 'nust-classic') => {
  const container = new Container();
  const g = new Graphics();
  
  // Get icon renderer or use default
  const iconFn = BUILDING_ICONS[type] || BUILDING_ICONS.landmark;
  iconFn(g, size);
  
  container.addChild(g);
  return container;
};

/**
 * Create a minigame marker icon
 */
export const createMinigameIcon = (type, size = 16) => {
  const container = new Container();
  const g = new Graphics();
  
  const iconFn = MINIGAME_ICONS[type] || MINIGAME_ICONS.trivia;
  iconFn(g, size);
  
  container.addChild(g);
  return container;
};

/**
 * Create a collectible icon
 */
export const createCollectibleIcon = (type, size = 10) => {
  const container = new Container();
  const g = new Graphics();
  
  const iconFn = COLLECTIBLE_ICONS[type] || COLLECTIBLE_ICONS.coin;
  iconFn(g, size);
  
  container.addChild(g);
  return container;
};

export default {
  BUILDING_ICONS,
  MINIGAME_ICONS,
  COLLECTIBLE_ICONS,
  createBuildingIcon,
  createMinigameIcon,
  createCollectibleIcon,
};
