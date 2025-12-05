/**
 * Props Generator - Enhanced environmental props with animations
 * Includes trees, benches, lampposts, trash cans, and decorative elements
 */

import { Graphics, Container, Text } from 'pixi.js';

/**
 * Prop type configurations
 */
export const PROP_TYPES = {
  tree: {
    variants: ['oak', 'pine', 'palm', 'cherry'],
    sizes: { small: 0.6, medium: 1, large: 1.4 },
    animated: true,
  },
  bench: {
    variants: ['wooden', 'metal', 'stone'],
    interactive: true,
  },
  lamppost: {
    variants: ['classic', 'modern', 'ornate'],
    animated: true, // Light flicker
    lightRadius: 60,
  },
  trashcan: {
    variants: ['bin', 'recycle'],
    interactive: true,
  },
  flowerbed: {
    variants: ['tulips', 'roses', 'mixed'],
    seasonal: true,
  },
  statue: {
    variants: ['founder', 'eagle', 'abstract'],
  },
  signpost: {
    variants: ['direction', 'info', 'warning'],
    interactive: true,
  },
  bush: {
    variants: ['round', 'hedge', 'flowering'],
    animated: true, // Subtle sway
  },
};

/**
 * Create an enhanced tree with seasonal variations
 */
export const createTree = (x, y, theme, options = {}) => {
  const { variant = 'oak', size = 'medium', season = 'summer' } = options;
  const scale = PROP_TYPES.tree.sizes[size] || 1;
  
  const tree = new Container();
  tree.x = x;
  tree.y = y;
  tree.zIndex = y;
  tree.label = 'tree';
  
  const g = new Graphics();
  
  // Shadow
  g.ellipse(0, 14 * scale, 16 * scale, 6 * scale);
  g.fill({ color: 0x000000, alpha: 0.2 });
  
  // Trunk with texture
  const trunkColor = theme?.props?.treeTrunkColor || 0x78350F;
  const trunkHighlight = 0x92400E;
  
  if (variant === 'pine') {
    // Pine tree trunk
    g.rect(-4 * scale, -10 * scale, 8 * scale, 28 * scale);
    g.fill({ color: trunkColor, alpha: 0.95 });
    g.rect(-2 * scale, -10 * scale, 2 * scale, 28 * scale);
    g.fill({ color: trunkHighlight, alpha: 0.3 });
  } else if (variant === 'palm') {
    // Palm tree curved trunk
    g.moveTo(-3 * scale, 14 * scale);
    g.bezierCurveTo(-4 * scale, 0, 2 * scale, -20 * scale, 0, -35 * scale);
    g.bezierCurveTo(2 * scale, -20 * scale, 8 * scale, 0, 5 * scale, 14 * scale);
    g.fill({ color: trunkColor, alpha: 0.95 });
  } else {
    // Oak/standard trunk
    g.rect(-5 * scale, -8 * scale, 10 * scale, 26 * scale);
    g.fill({ color: trunkColor, alpha: 0.95 });
    // Bark texture
    g.rect(-3 * scale, -6 * scale, 2 * scale, 22 * scale);
    g.fill({ color: trunkHighlight, alpha: 0.25 });
    // Trunk highlight
    g.rect(1 * scale, -4 * scale, 2 * scale, 18 * scale);
    g.fill({ color: 0x000000, alpha: 0.15 });
  }
  
  // Foliage
  let leafColor = theme?.props?.treeColor || 0x22C55E;
  const leafHighlight = theme?.props?.treeHighlight || 0x86EFAC;
  
  // Seasonal color adjustments
  if (season === 'autumn') {
    leafColor = [0xF97316, 0xFBBF24, 0xEF4444][Math.floor(Math.random() * 3)];
  } else if (season === 'winter') {
    leafColor = 0x94A3B8; // Bare/grey
  } else if (season === 'spring' && variant === 'cherry') {
    leafColor = 0xFDA4AF; // Cherry blossoms
  }
  
  if (variant === 'pine') {
    // Layered pine foliage
    for (let i = 0; i < 4; i++) {
      const layerY = -15 * scale - i * 12 * scale;
      const layerW = (20 - i * 4) * scale;
      g.moveTo(0, layerY - 15 * scale);
      g.lineTo(-layerW, layerY);
      g.lineTo(layerW, layerY);
      g.closePath();
      g.fill({ color: leafColor, alpha: 0.9 - i * 0.1 });
    }
    // Snow on pine (winter)
    if (season === 'winter') {
      for (let i = 0; i < 3; i++) {
        const snowY = -20 * scale - i * 12 * scale;
        g.ellipse(0, snowY, (12 - i * 3) * scale, 4 * scale);
        g.fill({ color: 0xFFFFFF, alpha: 0.85 });
      }
    }
  } else if (variant === 'palm') {
    // Palm fronds
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const frondLen = 25 * scale;
      g.moveTo(0, -35 * scale);
      g.bezierCurveTo(
        Math.cos(angle) * frondLen * 0.3, -35 * scale - 5,
        Math.cos(angle) * frondLen * 0.7, -35 * scale + Math.sin(angle) * 10,
        Math.cos(angle) * frondLen, -30 * scale + Math.abs(Math.sin(angle)) * 15
      );
      g.stroke({ width: 3 * scale, color: leafColor, alpha: 0.9 });
    }
  } else {
    // Oak/round foliage with depth
    // Back layer
    g.circle(-8 * scale, -28 * scale, 14 * scale);
    g.circle(8 * scale, -28 * scale, 14 * scale);
    g.fill({ color: leafColor, alpha: 0.7 });
    // Main canopy
    g.circle(0, -32 * scale, 20 * scale);
    g.fill({ color: leafColor, alpha: 0.9 });
    // Highlight
    g.circle(-5 * scale, -38 * scale, 10 * scale);
    g.fill({ color: leafHighlight, alpha: 0.4 });
    // Depth shadows
    g.circle(6 * scale, -26 * scale, 8 * scale);
    g.fill({ color: 0x000000, alpha: 0.15 });
    
    // Winter snow cap
    if (season === 'winter') {
      g.ellipse(0, -42 * scale, 15 * scale, 8 * scale);
      g.fill({ color: 0xFFFFFF, alpha: 0.9 });
    }
    
    // Cherry blossoms falling
    if (season === 'spring' && variant === 'cherry') {
      for (let i = 0; i < 5; i++) {
        const bx = (Math.random() - 0.5) * 40 * scale;
        const by = -20 * scale + Math.random() * 30 * scale;
        g.circle(bx, by, 2);
        g.fill({ color: 0xFDA4AF, alpha: 0.8 });
      }
    }
  }
  
  tree.addChild(g);
  tree.isAnimated = PROP_TYPES.tree.animated;
  tree.animationType = 'sway';
  tree.baseRotation = 0;
  
  return tree;
};

/**
 * Create a bench
 */
export const createBench = (x, y, theme, options = {}) => {
  const { variant = 'wooden', rotation = 0 } = options;
  
  const bench = new Container();
  bench.x = x;
  bench.y = y;
  bench.zIndex = y;
  bench.rotation = rotation;
  bench.label = 'bench';
  
  const g = new Graphics();
  
  // Shadow
  g.ellipse(0, 8, 18, 5);
  g.fill({ color: 0x000000, alpha: 0.2 });
  
  let seatColor, legColor;
  
  switch (variant) {
    case 'metal':
      seatColor = 0x64748B;
      legColor = 0x475569;
      // Metal bench
      g.roundRect(-18, -4, 36, 8, 1);
      g.fill({ color: seatColor, alpha: 0.95 });
      // Slats
      for (let i = 0; i < 5; i++) {
        g.rect(-16 + i * 8, -4, 6, 8);
        g.fill({ color: 0x94A3B8, alpha: 0.3 });
      }
      // Legs
      g.rect(-15, 2, 3, 8);
      g.rect(12, 2, 3, 8);
      g.fill({ color: legColor, alpha: 0.95 });
      break;
      
    case 'stone':
      seatColor = 0x9CA3AF;
      legColor = 0x6B7280;
      // Stone slab
      g.roundRect(-20, -5, 40, 10, 2);
      g.fill({ color: seatColor, alpha: 0.95 });
      // Stone texture
      g.roundRect(-18, -3, 10, 6, 1);
      g.fill({ color: 0xD1D5DB, alpha: 0.3 });
      // Supports
      g.rect(-18, 4, 8, 6);
      g.rect(10, 4, 8, 6);
      g.fill({ color: legColor, alpha: 0.95 });
      break;
      
    default: // wooden
      seatColor = theme?.props?.benchColor || 0xA16207;
      legColor = theme?.props?.benchBorderColor || 0x78350F;
      // Wooden planks
      g.roundRect(-16, -6, 32, 5, 1);
      g.fill({ color: seatColor, alpha: 0.95 });
      g.roundRect(-16, 0, 32, 5, 1);
      g.fill({ color: seatColor, alpha: 0.85 });
      // Wood grain
      g.rect(-14, -5, 28, 1);
      g.fill({ color: legColor, alpha: 0.2 });
      // Legs
      g.rect(-14, 4, 4, 7);
      g.rect(10, 4, 4, 7);
      g.fill({ color: legColor, alpha: 0.95 });
      // Arm rests
      g.rect(-18, -8, 4, 10);
      g.rect(14, -8, 4, 10);
      g.fill({ color: seatColor, alpha: 0.9 });
  }
  
  bench.addChild(g);
  bench.interactive = PROP_TYPES.bench.interactive;
  
  return bench;
};

/**
 * Create a lamppost with light effect
 */
export const createLamppost = (x, y, theme, options = {}) => {
  const { variant = 'classic', isOn = true } = options;
  
  const lamp = new Container();
  lamp.x = x;
  lamp.y = y;
  lamp.zIndex = y + 100; // Above most objects
  lamp.label = 'lamppost';
  
  const g = new Graphics();
  
  // Shadow
  g.ellipse(0, 8, 6, 3);
  g.fill({ color: 0x000000, alpha: 0.2 });
  
  const poleColor = variant === 'modern' ? 0x64748B : 0x374151;
  const lampColor = theme?.props?.lanternColor || 0xFDE047;
  
  // Pole
  if (variant === 'ornate') {
    // Ornate curved pole
    g.moveTo(-2, 8);
    g.bezierCurveTo(-3, -10, 0, -30, 0, -45);
    g.bezierCurveTo(0, -30, 3, -10, 2, 8);
    g.fill({ color: poleColor, alpha: 0.95 });
    // Decorative elements
    g.circle(0, -15, 3);
    g.fill({ color: poleColor, alpha: 0.95 });
  } else if (variant === 'modern') {
    // Modern angular pole
    g.rect(-2, -45, 4, 53);
    g.fill({ color: poleColor, alpha: 0.95 });
    // Arm
    g.rect(0, -45, 15, 3);
    g.fill({ color: poleColor, alpha: 0.95 });
  } else {
    // Classic pole
    g.rect(-3, -40, 6, 48);
    g.fill({ color: poleColor, alpha: 0.95 });
    // Base
    g.rect(-6, 4, 12, 4);
    g.fill({ color: poleColor, alpha: 0.95 });
  }
  
  lamp.addChild(g);
  
  // Light fixture
  const light = new Graphics();
  light.label = 'lightFixture';
  
  if (variant === 'modern') {
    light.rect(10, -48, 8, 5);
    light.fill({ color: 0x1F2937, alpha: 0.95 });
    if (isOn) {
      light.rect(11, -43, 6, 2);
      light.fill({ color: lampColor, alpha: 0.95 });
    }
  } else {
    // Classic lantern
    light.roundRect(-5, -52, 10, 12, 2);
    light.fill({ color: 0x1F2937, alpha: 0.95 });
    if (isOn) {
      light.roundRect(-4, -51, 8, 10, 1);
      light.fill({ color: lampColor, alpha: 0.9 });
    }
    // Top
    light.moveTo(0, -55);
    light.lineTo(-6, -52);
    light.lineTo(6, -52);
    light.closePath();
    light.fill({ color: 0x1F2937, alpha: 0.95 });
  }
  
  lamp.addChild(light);
  
  // Light glow (animated)
  if (isOn) {
    const glow = new Graphics();
    glow.label = 'glow';
    const glowY = variant === 'modern' ? -42 : -46;
    const glowX = variant === 'modern' ? 14 : 0;
    
    // Outer glow
    glow.circle(glowX, glowY, PROP_TYPES.lamppost.lightRadius);
    glow.fill({ color: lampColor, alpha: 0.08 });
    // Inner glow
    glow.circle(glowX, glowY, 30);
    glow.fill({ color: lampColor, alpha: 0.12 });
    // Core glow
    glow.circle(glowX, glowY, 15);
    glow.fill({ color: lampColor, alpha: 0.2 });
    
    lamp.addChild(glow);
    lamp.isAnimated = true;
    lamp.animationType = 'flicker';
  }
  
  return lamp;
};

/**
 * Create a trash can
 */
export const createTrashcan = (x, y, theme, options = {}) => {
  const { variant = 'bin' } = options;
  
  const trash = new Container();
  trash.x = x;
  trash.y = y;
  trash.zIndex = y;
  trash.label = 'trashcan';
  
  const g = new Graphics();
  
  // Shadow
  g.ellipse(0, 10, 8, 4);
  g.fill({ color: 0x000000, alpha: 0.2 });
  
  if (variant === 'recycle') {
    // Recycling bin - green
    g.roundRect(-8, -12, 16, 22, 2);
    g.fill({ color: 0x22C55E, alpha: 0.95 });
    // Recycle symbol (simplified)
    g.moveTo(0, -8);
    g.lineTo(-4, -2);
    g.lineTo(4, -2);
    g.closePath();
    g.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.8 });
  } else {
    // Regular trash bin - grey
    g.moveTo(-7, -12);
    g.lineTo(-9, 10);
    g.lineTo(9, 10);
    g.lineTo(7, -12);
    g.closePath();
    g.fill({ color: 0x4B5563, alpha: 0.95 });
    // Lid
    g.roundRect(-9, -15, 18, 4, 1);
    g.fill({ color: 0x374151, alpha: 0.95 });
    // Handle
    g.rect(-2, -18, 4, 3);
    g.fill({ color: 0x374151, alpha: 0.95 });
    // Lines
    g.rect(-5, -8, 1, 14);
    g.rect(4, -8, 1, 14);
    g.fill({ color: 0x374151, alpha: 0.3 });
  }
  
  trash.addChild(g);
  trash.interactive = true;
  
  return trash;
};

/**
 * Create a flower bed
 */
export const createFlowerbed = (x, y, width, height, theme, options = {}) => {
  const { variant = 'mixed', season = 'summer' } = options;
  
  const bed = new Container();
  bed.x = x;
  bed.y = y;
  bed.zIndex = y;
  bed.label = 'flowerbed';
  
  const g = new Graphics();
  
  // Bed border
  g.roundRect(-width/2 - 3, -height/2 - 3, width + 6, height + 6, 4);
  g.fill({ color: 0x78350F, alpha: 0.9 });
  
  // Soil
  g.roundRect(-width/2, -height/2, width, height, 2);
  g.fill({ color: 0x451A03, alpha: 0.9 });
  
  // Flowers based on variant and season
  if (season !== 'winter') {
    const flowerColors = {
      tulips: [0xEF4444, 0xF59E0B, 0xA855F7],
      roses: [0xEF4444, 0xEC4899, 0xFFFFFF],
      mixed: [0xEF4444, 0xF59E0B, 0xA855F7, 0x3B82F6, 0xEC4899],
    };
    
    const colors = flowerColors[variant] || flowerColors.mixed;
    const flowerCount = Math.floor((width * height) / 150);
    
    for (let i = 0; i < flowerCount; i++) {
      const fx = -width/2 + 5 + Math.random() * (width - 10);
      const fy = -height/2 + 5 + Math.random() * (height - 10);
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Stem
      g.rect(fx - 0.5, fy, 1, 6);
      g.fill({ color: 0x22C55E, alpha: 0.9 });
      
      // Flower head
      if (variant === 'tulips') {
        g.ellipse(fx, fy - 2, 3, 5);
        g.fill({ color, alpha: 0.9 });
      } else if (variant === 'roses') {
        g.circle(fx, fy - 2, 4);
        g.fill({ color, alpha: 0.9 });
        g.circle(fx, fy - 2, 2);
        g.fill({ color, alpha: 0.7 });
      } else {
        // Simple flower
        for (let p = 0; p < 5; p++) {
          const angle = (p / 5) * Math.PI * 2;
          g.circle(fx + Math.cos(angle) * 2, fy - 2 + Math.sin(angle) * 2, 2);
        }
        g.fill({ color, alpha: 0.9 });
        g.circle(fx, fy - 2, 1.5);
        g.fill({ color: 0xFDE047, alpha: 1 });
      }
    }
  } else {
    // Winter - snow covered
    g.roundRect(-width/2 + 2, -height/2 + 2, width - 4, height - 4, 2);
    g.fill({ color: 0xFFFFFF, alpha: 0.8 });
  }
  
  bed.addChild(g);
  
  return bed;
};

/**
 * Create a bush
 */
export const createBush = (x, y, theme, options = {}) => {
  const { variant = 'round', size = 1 } = options;
  
  const bush = new Container();
  bush.x = x;
  bush.y = y;
  bush.zIndex = y;
  bush.label = 'bush';
  
  const g = new Graphics();
  const bushColor = theme?.props?.treeColor || 0x22C55E;
  const highlightColor = theme?.props?.treeHighlight || 0x86EFAC;
  
  // Shadow
  g.ellipse(0, 8 * size, 14 * size, 5 * size);
  g.fill({ color: 0x000000, alpha: 0.15 });
  
  if (variant === 'hedge') {
    // Rectangular hedge
    g.roundRect(-20 * size, -12 * size, 40 * size, 20 * size, 4);
    g.fill({ color: bushColor, alpha: 0.95 });
    g.roundRect(-18 * size, -14 * size, 20 * size, 10 * size, 2);
    g.fill({ color: highlightColor, alpha: 0.3 });
  } else if (variant === 'flowering') {
    // Bush with flowers
    g.circle(0, -5 * size, 15 * size);
    g.fill({ color: bushColor, alpha: 0.95 });
    g.circle(-4 * size, -8 * size, 8 * size);
    g.fill({ color: highlightColor, alpha: 0.4 });
    // Flowers
    const flowerColors = [0xEC4899, 0xA855F7, 0xFFFFFF];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const fx = Math.cos(angle) * 10 * size;
      const fy = -5 * size + Math.sin(angle) * 8 * size;
      g.circle(fx, fy, 3 * size);
      g.fill({ color: flowerColors[i % 3], alpha: 0.9 });
    }
  } else {
    // Round bush
    g.circle(0, -4 * size, 14 * size);
    g.fill({ color: bushColor, alpha: 0.95 });
    g.circle(-5 * size, -7 * size, 8 * size);
    g.fill({ color: highlightColor, alpha: 0.35 });
    g.circle(4 * size, -2 * size, 6 * size);
    g.fill({ color: 0x000000, alpha: 0.1 });
  }
  
  bush.addChild(g);
  bush.isAnimated = true;
  bush.animationType = 'sway';
  bush.baseRotation = 0;
  
  return bush;
};

/**
 * Create a signpost
 */
export const createSignpost = (x, y, text, theme, options = {}) => {
  const { variant = 'direction', direction = 'right' } = options;
  
  const sign = new Container();
  sign.x = x;
  sign.y = y;
  sign.zIndex = y + 50;
  sign.label = 'signpost';
  
  const g = new Graphics();
  
  // Pole
  g.rect(-2, -35, 4, 43);
  g.fill({ color: 0x78350F, alpha: 0.95 });
  
  if (variant === 'direction') {
    // Arrow sign
    const arrowDir = direction === 'left' ? -1 : 1;
    g.moveTo(arrowDir * 5, -30);
    g.lineTo(arrowDir * 35, -30);
    g.lineTo(arrowDir * 40, -25);
    g.lineTo(arrowDir * 35, -20);
    g.lineTo(arrowDir * 5, -20);
    g.closePath();
    g.fill({ color: 0xA16207, alpha: 0.95 });
  } else if (variant === 'info') {
    // Info board
    g.roundRect(-25, -45, 50, 30, 3);
    g.fill({ color: 0x1E3A8A, alpha: 0.95 });
    g.stroke({ width: 2, color: 0xFFFFFF, alpha: 0.5 });
  } else {
    // Warning sign (triangle)
    g.moveTo(0, -50);
    g.lineTo(-20, -20);
    g.lineTo(20, -20);
    g.closePath();
    g.fill({ color: 0xFBBF24, alpha: 0.95 });
    g.stroke({ width: 2, color: 0x000000, alpha: 0.8 });
  }
  
  sign.addChild(g);
  
  // Text label
  if (text) {
    const label = new Text({
      text: text,
      style: {
        fontSize: 8,
        fill: variant === 'warning' ? 0x000000 : 0xFFFFFF,
        fontWeight: 'bold',
      }
    });
    label.anchor.set(0.5);
    label.y = variant === 'info' ? -30 : -25;
    label.x = variant === 'direction' ? (direction === 'left' ? -20 : 20) : 0;
    sign.addChild(label);
  }
  
  sign.interactive = true;
  
  return sign;
};

/**
 * Update prop animations
 */
export const updatePropAnimations = (props, time, windStrength = 0.5) => {
  props.forEach((prop) => {
    if (!prop.isAnimated) return;
    
    switch (prop.animationType) {
      case 'sway':
        // Tree/bush sway
        const sway = Math.sin(time * 0.002 + prop.x * 0.01) * windStrength * 0.04;
        prop.rotation = prop.baseRotation + sway;
        prop.skew.x = sway * 0.2;
        break;
        
      case 'flicker':
        // Lamppost flicker
        const glow = prop.getChildByLabel('glow');
        if (glow) {
          const flicker = 0.8 + Math.sin(time * 0.01 + prop.x) * 0.1 + Math.random() * 0.1;
          glow.alpha = flicker;
        }
        break;
    }
  });
};

export default {
  PROP_TYPES,
  createTree,
  createBench,
  createLamppost,
  createTrashcan,
  createFlowerbed,
  createBush,
  createSignpost,
  updatePropAnimations,
};
