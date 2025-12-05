/**
 * Visual Effects Module - Enhanced environmental effects
 * Provides particle systems, lighting effects, and animations
 */

import { Graphics, Container, BlurFilter } from 'pixi.js';

/**
 * Particle System Configuration
 */
const PARTICLE_CONFIG = {
  leaves: {
    count: 15,
    colors: [0x22C55E, 0x16A34A, 0xFBBF24, 0xF97316],
    size: { min: 3, max: 6 },
    speed: { min: 0.3, max: 0.8 },
    rotation: { min: 0.01, max: 0.03 },
    lifetime: 8000,
  },
  snow: {
    count: 30,
    colors: [0xFFFFFF, 0xF0F9FF, 0xE0F2FE],
    size: { min: 2, max: 5 },
    speed: { min: 0.5, max: 1.2 },
    drift: { min: -0.3, max: 0.3 },
    lifetime: 10000,
  },
  fireflies: {
    count: 20,
    colors: [0xFDE047, 0xFACC15, 0x84CC16],
    size: { min: 2, max: 4 },
    speed: { min: 0.2, max: 0.5 },
    pulseSpeed: 0.005,
    lifetime: 12000,
  },
  glitchRain: {
    count: 40,
    colors: [0x00FFFF, 0xFF00FF, 0x00FF00],
    size: { min: 1, max: 3 },
    speed: { min: 3, max: 6 },
    length: { min: 10, max: 25 },
    lifetime: 2000,
  },
};

/**
 * Create a particle system
 */
export const createParticleSystem = (type, bounds, themeMode) => {
  const container = new Container();
  container.label = `particles-${type}`;
  const config = PARTICLE_CONFIG[type];
  if (!config) return container;

  const particles = [];
  
  for (let i = 0; i < config.count; i++) {
    const particle = createParticle(type, config, bounds);
    particles.push(particle);
    container.addChild(particle.sprite);
  }
  
  container.particles = particles;
  container.config = config;
  container.bounds = bounds;
  container.particleType = type;
  
  return container;
};

/**
 * Create individual particle
 */
const createParticle = (type, config, bounds) => {
  const g = new Graphics();
  const color = config.colors[Math.floor(Math.random() * config.colors.length)];
  const size = config.size.min + Math.random() * (config.size.max - config.size.min);
  
  switch (type) {
    case 'leaves':
      // Leaf shape
      g.moveTo(0, -size);
      g.bezierCurveTo(size, -size * 0.5, size, size * 0.5, 0, size);
      g.bezierCurveTo(-size, size * 0.5, -size, -size * 0.5, 0, -size);
      g.fill({ color, alpha: 0.8 });
      break;
      
    case 'snow':
      g.circle(0, 0, size);
      g.fill({ color, alpha: 0.9 });
      break;
      
    case 'fireflies':
      // Glow
      g.circle(0, 0, size * 3);
      g.fill({ color, alpha: 0.15 });
      // Core
      g.circle(0, 0, size);
      g.fill({ color, alpha: 0.9 });
      break;
      
    case 'glitchRain':
      const len = config.length.min + Math.random() * (config.length.max - config.length.min);
      g.rect(-0.5, 0, 1, len);
      g.fill({ color, alpha: 0.7 });
      break;
  }
  
  return {
    sprite: g,
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
    vx: 0,
    vy: config.speed.min + Math.random() * (config.speed.max - config.speed.min),
    rotation: 0,
    rotationSpeed: config.rotation ? config.rotation.min + Math.random() * (config.rotation.max - config.rotation.min) : 0,
    alpha: 1,
    phase: Math.random() * Math.PI * 2,
    size,
  };
};

/**
 * Update particle system
 */
export const updateParticleSystem = (container, delta, time) => {
  if (!container.particles) return;
  
  const { particles, config, bounds, particleType } = container;
  
  particles.forEach(p => {
    switch (particleType) {
      case 'leaves':
        p.x += Math.sin(time * 0.001 + p.phase) * 0.5 * delta;
        p.y += p.vy * delta;
        p.rotation += p.rotationSpeed * delta;
        p.sprite.rotation = p.rotation;
        break;
        
      case 'snow':
        p.x += Math.sin(time * 0.002 + p.phase) * 0.3 * delta;
        p.y += p.vy * delta;
        break;
        
      case 'fireflies':
        p.x += Math.sin(time * 0.001 + p.phase) * p.vy * delta;
        p.y += Math.cos(time * 0.0015 + p.phase * 1.5) * p.vy * delta;
        p.alpha = 0.4 + Math.sin(time * config.pulseSpeed + p.phase) * 0.6;
        p.sprite.alpha = p.alpha;
        break;
        
      case 'glitchRain':
        p.y += p.vy * delta;
        p.alpha = 0.3 + Math.random() * 0.7; // Glitch effect
        p.sprite.alpha = p.alpha;
        break;
    }
    
    // Wrap around bounds
    if (p.y > bounds.height + 50) {
      p.y = -50;
      p.x = Math.random() * bounds.width;
    }
    if (p.y < -50) p.y = bounds.height + 50;
    if (p.x > bounds.width + 50) p.x = -50;
    if (p.x < -50) p.x = bounds.width + 50;
    
    p.sprite.x = p.x;
    p.sprite.y = p.y;
  });
};

/**
 * Ambient lighting effects
 */
export const createAmbientLight = (color, intensity, bounds) => {
  const container = new Container();
  
  // Radial gradient overlay
  const overlay = new Graphics();
  const centerX = bounds.width / 2;
  const centerY = bounds.height / 2;
  const radius = Math.max(bounds.width, bounds.height);
  
  // Create vignette effect
  overlay.rect(0, 0, bounds.width, bounds.height);
  overlay.fill({ color: 0x000000, alpha: intensity * 0.3 });
  
  container.addChild(overlay);
  container.label = 'ambient-light';
  
  return container;
};

/**
 * Create glowing effect for objects
 */
export const createGlow = (radius, color, intensity = 0.5) => {
  const glow = new Graphics();
  
  // Multiple circles for soft glow
  for (let i = 3; i > 0; i--) {
    glow.circle(0, 0, radius * (1 + i * 0.3));
    glow.fill({ color, alpha: intensity / (i + 1) });
  }
  
  return glow;
};

/**
 * Lantern flicker effect
 */
export const updateLanternFlicker = (lanterns, time) => {
  lanterns.forEach((lantern, i) => {
    if (lantern.glowSprite) {
      const flicker = 0.7 + Math.sin(time * 0.008 + i * 0.5) * 0.15 + Math.random() * 0.1;
      lantern.glowSprite.alpha = flicker;
      lantern.glowSprite.scale.set(0.9 + flicker * 0.2);
    }
  });
};

/**
 * Tree sway animation
 */
export const updateTreeSway = (trees, time, windStrength = 0.5) => {
  trees.forEach((tree, i) => {
    const sway = Math.sin(time * 0.002 + i * 0.7) * windStrength * 0.05;
    tree.rotation = sway;
    // Skew for more natural look
    tree.skew.x = sway * 0.3;
  });
};

/**
 * Water/Fountain ripple effect
 */
export const createWaterRipple = (x, y, maxRadius = 30) => {
  const container = new Container();
  container.x = x;
  container.y = y;
  
  const ripple = new Graphics();
  container.addChild(ripple);
  
  container.update = (time, startTime) => {
    const elapsed = time - startTime;
    const progress = (elapsed % 2000) / 2000;
    const radius = progress * maxRadius;
    const alpha = 1 - progress;
    
    ripple.clear();
    ripple.circle(0, 0, radius);
    ripple.stroke({ width: 2, color: 0x60A5FA, alpha: alpha * 0.5 });
  };
  
  return container;
};

/**
 * Neon pulse effect for cyberpunk mode
 */
export const updateNeonPulse = (elements, time) => {
  elements.forEach((el, i) => {
    if (el.neonGlow) {
      const pulse = 0.5 + Math.sin(time * 0.005 + i) * 0.3;
      el.neonGlow.alpha = pulse;
    }
  });
};

/**
 * Scanline effect for pixel-retro mode
 */
export const createScanlines = (width, height) => {
  const container = new Container();
  const lines = new Graphics();
  
  for (let y = 0; y < height; y += 4) {
    lines.rect(0, y, width, 1);
  }
  lines.fill({ color: 0x000000, alpha: 0.1 });
  
  container.addChild(lines);
  container.label = 'scanlines';
  
  return container;
};

/**
 * Day/Night cycle color adjustments
 */
export const getDayNightTint = (hour) => {
  // hour: 0-24
  if (hour >= 6 && hour < 8) {
    // Dawn - warm orange tint
    return { tint: 0xFFE4C4, intensity: 0.2 };
  } else if (hour >= 8 && hour < 17) {
    // Day - no tint
    return { tint: 0xFFFFFF, intensity: 0 };
  } else if (hour >= 17 && hour < 19) {
    // Dusk - golden hour
    return { tint: 0xFFD700, intensity: 0.15 };
  } else {
    // Night - blue tint
    return { tint: 0x4169E1, intensity: 0.25 };
  }
};

export default {
  createParticleSystem,
  updateParticleSystem,
  createAmbientLight,
  createGlow,
  updateLanternFlicker,
  updateTreeSway,
  createWaterRipple,
  updateNeonPulse,
  createScanlines,
  getDayNightTint,
};
