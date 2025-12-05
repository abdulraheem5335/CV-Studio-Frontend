/**
 * Terrain Generator - Advanced tile-based terrain with textures and animations
 * Optimized for Pixi.js with batched rendering and object pooling
 */

import { Graphics, Container, RenderTexture, Sprite } from 'pixi.js';

/**
 * Terrain tile types and their visual properties
 */
export const TERRAIN_TYPES = {
  grass: {
    baseColors: [0x4ADE80, 0x22C55E, 0x86EFAC, 0x3DDC84],
    detailColor: 0x166534,
    hasBlades: true,
    bladeCount: 3,
  },
  path: {
    baseColors: [0xA8A29E, 0x78716C, 0x8B8680],
    detailColor: 0x57534E,
    hasStones: true,
    stoneCount: 4,
  },
  water: {
    baseColors: [0x38BDF8, 0x0EA5E9, 0x7DD3FC],
    detailColor: 0x0284C7,
    animated: true,
    waveSpeed: 0.002,
  },
  sand: {
    baseColors: [0xFDE68A, 0xFCD34D, 0xFEF3C7],
    detailColor: 0xF59E0B,
    hasGrains: true,
  },
  dirt: {
    baseColors: [0x92400E, 0xA16207, 0x78350F],
    detailColor: 0x713F12,
    hasRocks: true,
  },
};

/**
 * Seasonal variations for terrain
 */
export const SEASONAL_TERRAIN = {
  spring: {
    grass: { baseColors: [0x86EFAC, 0x4ADE80, 0xBBF7D0], flowers: true, flowerColors: [0xFDA4AF, 0xFBCFE8, 0xFDE047] },
    trees: { leafColor: 0x86EFAC, hasFlowers: true },
  },
  summer: {
    grass: { baseColors: [0x4ADE80, 0x22C55E, 0x16A34A], flowers: false },
    trees: { leafColor: 0x22C55E, hasFlowers: false },
  },
  autumn: {
    grass: { baseColors: [0xA3BE8C, 0x8B9A6B, 0x6B7353], leaves: true, leafColors: [0xF97316, 0xFBBF24, 0xEF4444] },
    trees: { leafColor: 0xF97316, fallingLeaves: true },
  },
  winter: {
    grass: { baseColors: [0xE2E8F0, 0xCBD5E1, 0xF1F5F9], snow: true },
    trees: { leafColor: 0x94A3B8, hasSnow: true, bare: true },
  },
};

/**
 * Event/Festival decorations
 */
export const EVENT_DECORATIONS = {
  festival: {
    banners: { colors: [0xEF4444, 0xF59E0B, 0x22C55E, 0x3B82F6], spacing: 150 },
    lights: { color: 0xFDE047, spacing: 80, animated: true },
    flags: { colors: [0x22C55E, 0xFFFFFF], positions: 'gates' },
  },
  sports: {
    flags: { colors: [0x3B82F6, 0xFFFFFF], positions: 'sports' },
    markers: { color: 0xEF4444, positions: 'sports' },
  },
  graduation: {
    banners: { colors: [0x1E3A8A, 0xFFD700], spacing: 200 },
    confetti: { colors: [0xFFD700, 0x1E3A8A, 0xFFFFFF], animated: true },
  },
};

/**
 * Create textured grass tile
 */
export const createGrassTile = (g, x, y, size, theme, season = 'summer') => {
  const seasonConfig = SEASONAL_TERRAIN[season]?.grass || SEASONAL_TERRAIN.summer.grass;
  const colors = seasonConfig.baseColors || TERRAIN_TYPES.grass.baseColors;
  
  // Base grass color with subtle variation
  const baseColor = colors[Math.floor(Math.random() * colors.length)];
  g.rect(x, y, size, size);
  g.fill({ color: baseColor, alpha: 0.9 });
  
  // Grass texture - small darker patches
  const patchCount = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < patchCount; i++) {
    const px = x + Math.random() * (size - 8);
    const py = y + Math.random() * (size - 8);
    const ps = 4 + Math.random() * 6;
    g.ellipse(px + ps/2, py + ps/2, ps/2, ps/3);
    g.fill({ color: colors[(i + 1) % colors.length], alpha: 0.4 });
  }
  
  // Grass blades detail (sparse for performance)
  if (Math.random() > 0.7) {
    const bladeX = x + size/2 + (Math.random() - 0.5) * size * 0.6;
    const bladeY = y + size/2 + (Math.random() - 0.5) * size * 0.3;
    drawGrassBlades(g, bladeX, bladeY, theme);
  }
  
  // Spring flowers
  if (seasonConfig.flowers && Math.random() > 0.85) {
    const fx = x + 4 + Math.random() * (size - 8);
    const fy = y + 4 + Math.random() * (size - 8);
    const flowerColor = seasonConfig.flowerColors[Math.floor(Math.random() * seasonConfig.flowerColors.length)];
    drawFlower(g, fx, fy, flowerColor);
  }
  
  // Autumn fallen leaves
  if (seasonConfig.leaves && Math.random() > 0.8) {
    const lx = x + Math.random() * size;
    const ly = y + Math.random() * size;
    const leafColor = seasonConfig.leafColors[Math.floor(Math.random() * seasonConfig.leafColors.length)];
    drawFallenLeaf(g, lx, ly, leafColor);
  }
  
  // Winter snow patches
  if (seasonConfig.snow && Math.random() > 0.6) {
    const sx = x + Math.random() * (size - 10);
    const sy = y + Math.random() * (size - 10);
    g.ellipse(sx + 5, sy + 3, 6 + Math.random() * 4, 3 + Math.random() * 2);
    g.fill({ color: 0xFFFFFF, alpha: 0.7 + Math.random() * 0.3 });
  }
};

/**
 * Draw grass blades
 */
const drawGrassBlades = (g, x, y, theme) => {
  const bladeColor = theme?.props?.treeColor || 0x166534;
  for (let i = 0; i < 3; i++) {
    const bx = x + (i - 1) * 2;
    const height = 4 + Math.random() * 3;
    g.moveTo(bx, y);
    g.lineTo(bx - 1, y - height);
    g.lineTo(bx + 1, y - height);
    g.closePath();
    g.fill({ color: bladeColor, alpha: 0.6 });
  }
};

/**
 * Draw small flower
 */
const drawFlower = (g, x, y, color) => {
  // Petals
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const px = x + Math.cos(angle) * 2;
    const py = y + Math.sin(angle) * 2;
    g.circle(px, py, 1.5);
    g.fill({ color, alpha: 0.9 });
  }
  // Center
  g.circle(x, y, 1);
  g.fill({ color: 0xFDE047, alpha: 1 });
};

/**
 * Draw fallen leaf
 */
const drawFallenLeaf = (g, x, y, color) => {
  g.moveTo(x, y - 2);
  g.bezierCurveTo(x + 3, y - 1, x + 3, y + 2, x, y + 3);
  g.bezierCurveTo(x - 3, y + 2, x - 3, y - 1, x, y - 2);
  g.fill({ color, alpha: 0.8 });
};

/**
 * Create path/walkway tile
 */
export const createPathTile = (g, x, y, size, theme, variant = 'cobblestone') => {
  const colors = TERRAIN_TYPES.path.baseColors;
  const baseColor = colors[0];
  
  g.rect(x, y, size, size);
  g.fill({ color: baseColor, alpha: 0.95 });
  
  if (variant === 'cobblestone') {
    // Cobblestone pattern
    const stoneSize = size / 3;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const offset = row % 2 === 0 ? 0 : stoneSize / 2;
        const sx = x + col * stoneSize + offset;
        const sy = y + row * stoneSize;
        const variation = colors[(row + col) % colors.length];
        
        g.roundRect(sx + 1, sy + 1, stoneSize - 2, stoneSize - 2, 2);
        g.fill({ color: variation, alpha: 0.8 });
        g.stroke({ width: 0.5, color: TERRAIN_TYPES.path.detailColor, alpha: 0.4 });
      }
    }
  } else if (variant === 'brick') {
    // Brick pattern
    const brickW = size / 2;
    const brickH = size / 4;
    for (let row = 0; row < 4; row++) {
      const offset = row % 2 === 0 ? 0 : brickW / 2;
      for (let col = -1; col < 3; col++) {
        const bx = x + col * brickW + offset;
        const by = y + row * brickH;
        if (bx >= x && bx + brickW <= x + size) {
          g.rect(bx + 0.5, by + 0.5, brickW - 1, brickH - 1);
          g.fill({ color: 0xB45309, alpha: 0.9 });
          g.stroke({ width: 0.5, color: 0x92400E, alpha: 0.5 });
        }
      }
    }
  }
};

/**
 * Create animated water tile (returns container for animation)
 */
export const createWaterTile = (x, y, size, theme) => {
  const container = new Container();
  container.x = x;
  container.y = y;
  
  const water = new Graphics();
  const colors = TERRAIN_TYPES.water.baseColors;
  
  // Base water
  water.rect(0, 0, size, size);
  water.fill({ color: colors[0], alpha: 0.9 });
  
  // Wave lines (will be animated)
  const waves = new Graphics();
  waves.label = 'waves';
  for (let i = 0; i < 3; i++) {
    waves.moveTo(0, size * 0.25 + i * size * 0.25);
    waves.bezierCurveTo(
      size * 0.25, size * 0.2 + i * size * 0.25,
      size * 0.75, size * 0.3 + i * size * 0.25,
      size, size * 0.25 + i * size * 0.25
    );
    waves.stroke({ width: 1, color: 0xFFFFFF, alpha: 0.3 });
  }
  
  // Sparkle highlights
  const sparkles = new Graphics();
  sparkles.label = 'sparkles';
  for (let i = 0; i < 3; i++) {
    const sx = Math.random() * size;
    const sy = Math.random() * size;
    sparkles.circle(sx, sy, 1);
    sparkles.fill({ color: 0xFFFFFF, alpha: 0.6 });
  }
  
  container.addChild(water);
  container.addChild(waves);
  container.addChild(sparkles);
  
  // Animation data
  container.isAnimated = true;
  container.animationType = 'water';
  
  return container;
};

/**
 * Update water animation
 */
export const updateWaterAnimation = (waterTile, time) => {
  if (!waterTile.isAnimated) return;
  
  const waves = waterTile.getChildByLabel('waves');
  const sparkles = waterTile.getChildByLabel('sparkles');
  
  if (waves) {
    waves.y = Math.sin(time * TERRAIN_TYPES.water.waveSpeed) * 2;
  }
  
  if (sparkles) {
    sparkles.alpha = 0.4 + Math.sin(time * 0.003) * 0.3;
  }
};

/**
 * Create pond/water feature
 */
export const createPond = (x, y, width, height, theme) => {
  const container = new Container();
  container.x = x;
  container.y = y;
  container.zIndex = y - 10; // Below other objects
  
  const g = new Graphics();
  
  // Outer edge (dirt/stones)
  g.ellipse(width/2, height/2, width/2 + 5, height/2 + 5);
  g.fill({ color: 0x78350F, alpha: 0.8 });
  
  // Water body
  g.ellipse(width/2, height/2, width/2, height/2);
  g.fill({ color: 0x0EA5E9, alpha: 0.9 });
  
  // Water highlight
  g.ellipse(width/2 - width*0.1, height/2 - height*0.1, width*0.3, height*0.2);
  g.fill({ color: 0x7DD3FC, alpha: 0.5 });
  
  // Lily pads (optional)
  for (let i = 0; i < 2; i++) {
    const lx = width * 0.3 + Math.random() * width * 0.4;
    const ly = height * 0.3 + Math.random() * height * 0.4;
    g.circle(lx, ly, 6);
    g.fill({ color: 0x22C55E, alpha: 0.8 });
    // Lily flower
    if (Math.random() > 0.5) {
      g.circle(lx, ly - 2, 2);
      g.fill({ color: 0xFDA4AF, alpha: 0.9 });
    }
  }
  
  container.addChild(g);
  container.isAnimated = true;
  container.animationType = 'pond';
  
  return container;
};

/**
 * Create fountain
 */
export const createFountain = (x, y, size, theme) => {
  const container = new Container();
  container.x = x;
  container.y = y;
  container.zIndex = y;
  
  const base = new Graphics();
  
  // Base pool
  base.ellipse(0, size * 0.3, size, size * 0.4);
  base.fill({ color: 0x64748B, alpha: 0.9 });
  base.ellipse(0, size * 0.25, size - 4, size * 0.35);
  base.fill({ color: 0x0EA5E9, alpha: 0.9 });
  
  // Center pedestal
  base.ellipse(0, 0, size * 0.3, size * 0.15);
  base.fill({ color: 0x94A3B8, alpha: 0.95 });
  base.rect(-size * 0.15, -size * 0.4, size * 0.3, size * 0.4);
  base.fill({ color: 0x94A3B8, alpha: 0.95 });
  base.ellipse(0, -size * 0.4, size * 0.2, size * 0.1);
  base.fill({ color: 0xCBD5E1, alpha: 0.95 });
  
  container.addChild(base);
  
  // Water spray particles (animated)
  const spray = new Container();
  spray.label = 'spray';
  for (let i = 0; i < 8; i++) {
    const drop = new Graphics();
    const angle = (i / 8) * Math.PI * 2;
    drop.circle(0, 0, 2);
    drop.fill({ color: 0x7DD3FC, alpha: 0.7 });
    drop.x = Math.cos(angle) * size * 0.15;
    drop.y = -size * 0.5;
    drop.baseAngle = angle;
    spray.addChild(drop);
  }
  container.addChild(spray);
  
  container.isAnimated = true;
  container.animationType = 'fountain';
  
  return container;
};

/**
 * Update fountain animation
 */
export const updateFountainAnimation = (fountain, time) => {
  const spray = fountain.getChildByLabel('spray');
  if (!spray) return;
  
  spray.children.forEach((drop, i) => {
    const t = (time * 0.003 + i * 0.5) % (Math.PI * 2);
    const height = Math.sin(t) * 15;
    const spread = Math.abs(Math.sin(t)) * 8;
    
    drop.x = Math.cos(drop.baseAngle) * (10 + spread);
    drop.y = -30 - height;
    drop.alpha = 0.3 + Math.sin(t) * 0.4;
    drop.scale.set(0.5 + Math.sin(t) * 0.5);
  });
};

/**
 * Batch render static terrain to texture for performance
 */
export const batchTerrainToTexture = async (app, width, height, renderFn) => {
  const renderTexture = RenderTexture.create({ width, height });
  const container = new Container();
  
  renderFn(container);
  
  app.renderer.render({ container, target: renderTexture });
  
  const sprite = new Sprite(renderTexture);
  sprite.label = 'batchedTerrain';
  
  return sprite;
};

/**
 * TerrainGenerator Class - Main interface for terrain generation
 */
export class TerrainGenerator {
  constructor(mapWidth, mapHeight, tileSize = 32) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.tileSize = tileSize;
    this.season = 'summer';
    this.waterBodies = [];
    this.decorations = [];
  }
  
  /**
   * Set seasonal theme
   */
  setSeasonalTheme(season) {
    this.season = season;
  }
  
  /**
   * Generate main terrain layer
   */
  generateTerrain(config = {}) {
    const container = new Container();
    container.label = 'terrainBase';
    
    const terrain = new Graphics();
    const { grassColors, baseColor } = config;
    
    // Base ground fill
    terrain.rect(0, 0, this.mapWidth, this.mapHeight);
    terrain.fill({ color: baseColor || 0x22C55E, alpha: 1 });
    
    // Generate textured grass tiles
    const cols = Math.ceil(this.mapWidth / this.tileSize);
    const rows = Math.ceil(this.mapHeight / this.tileSize);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * this.tileSize;
        const y = row * this.tileSize;
        createGrassTile(terrain, x, y, this.tileSize, { props: { treeColor: 0x166534 } }, this.season);
      }
    }
    
    container.addChild(terrain);
    return container;
  }
  
  /**
   * Add water bodies (ponds, fountains)
   */
  addWaterBodies(waterAreas = []) {
    const container = new Container();
    container.label = 'waterBodies';
    container.sortableChildren = true;
    
    waterAreas.forEach((area) => {
      let waterFeature;
      if (area.type === 'fountain') {
        waterFeature = createFountain(area.x, area.y, area.radius || 30, {});
      } else {
        waterFeature = createPond(area.x - area.radius, area.y - area.radius/2, area.radius * 2, area.radius, {});
      }
      this.waterBodies.push(waterFeature);
      container.addChild(waterFeature);
    });
    
    return container;
  }
  
  /**
   * Add decorative elements
   */
  addDecorations(count = 30) {
    const container = new Container();
    container.label = 'decorations';
    
    const decorG = new Graphics();
    
    // Scatter small rocks
    for (let i = 0; i < count / 3; i++) {
      const x = Math.random() * this.mapWidth;
      const y = Math.random() * this.mapHeight;
      const size = 2 + Math.random() * 4;
      decorG.ellipse(x, y, size, size * 0.6);
      decorG.fill({ color: 0x78716C, alpha: 0.6 });
    }
    
    // Scatter flowers (if spring/summer)
    if (this.season === 'spring' || this.season === 'summer') {
      const flowerColors = [0xFDA4AF, 0xFBCFE8, 0xFDE047, 0xA855F7];
      for (let i = 0; i < count / 2; i++) {
        const x = Math.random() * this.mapWidth;
        const y = Math.random() * this.mapHeight;
        const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        drawFlower(decorG, x, y, color);
      }
    }
    
    // Scatter fallen leaves (if autumn)
    if (this.season === 'autumn') {
      const leafColors = [0xF97316, 0xFBBF24, 0xEF4444];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * this.mapWidth;
        const y = Math.random() * this.mapHeight;
        const color = leafColors[Math.floor(Math.random() * leafColors.length)];
        drawFallenLeaf(decorG, x, y, color);
      }
    }
    
    // Snow patches (if winter)
    if (this.season === 'winter') {
      for (let i = 0; i < count; i++) {
        const x = Math.random() * this.mapWidth;
        const y = Math.random() * this.mapHeight;
        decorG.ellipse(x, y, 8 + Math.random() * 12, 4 + Math.random() * 6);
        decorG.fill({ color: 0xFFFFFF, alpha: 0.6 + Math.random() * 0.3 });
      }
    }
    
    container.addChild(decorG);
    return container;
  }
  
  /**
   * Update water animations
   */
  updateWaterAnimation(time) {
    this.waterBodies.forEach((water) => {
      if (water.animationType === 'fountain') {
        updateFountainAnimation(water, time);
      } else if (water.animationType === 'pond') {
        // Simple wave effect for ponds
        water.y = water.y + Math.sin(time * 0.002) * 0.1 - Math.sin((time - 16) * 0.002) * 0.1;
      }
    });
  }
}

export default {
  TERRAIN_TYPES,
  SEASONAL_TERRAIN,
  EVENT_DECORATIONS,
  createGrassTile,
  createPathTile,
  createWaterTile,
  updateWaterAnimation,
  createPond,
  createFountain,
  updateFountainAnimation,
  batchTerrainToTexture,
  TerrainGenerator,
};
