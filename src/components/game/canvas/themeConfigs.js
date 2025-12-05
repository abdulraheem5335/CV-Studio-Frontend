/**
 * Theme Configurations for Pixi Canvas Map
 * Each theme defines colors, styles, and visual parameters
 * ENHANCED: Improved contrast, readability, and visual effects
 */

const themeConfigs = {
  'nust-classic': {
    backgroundColor: 0x1A2634,
    terrain: {
      baseColor: 0x4ADE80,
      variations: [0x4ADE80, 0x86EFAC, 0x22C55E, 0x3DDC84, 0x34D399],
      gridColor: 0x166534,
      textureIntensity: 0.15,
    },
    roads: {
      baseColor: 0x52525B,
      width: 26,
      markingColor: 0xFFFFFF,
      borderColor: 0x3F3F46,
      shadowColor: 0x27272A,
    },
    props: {
      density: { trees: 30, benches: 8, lanterns: 0 },
      treeColor: 0x22C55E,
      treeTrunkColor: 0x78350F,
      treeHighlight: 0x86EFAC,
      benchColor: 0x78716C,
      benchBorderColor: 0x57534E,
    },
    buildings: {
      default: { borderColor: 0xE5E7EB, windowColor: 0xFEF3C7, doorColor: 0x4B5563, shadowAlpha: 0.25 },
      academic: { borderColor: 0x60A5FA, windowColor: 0xBFDBFE, doorColor: 0x1E3A8A, shadowAlpha: 0.3 },
      hostel: { borderColor: 0xF472B6, windowColor: 0xFCE7F3, doorColor: 0x831843, shadowAlpha: 0.25 },
      hostel_girls: { borderColor: 0xF472B6, windowColor: 0xFCE7F3, doorColor: 0x831843, shadowAlpha: 0.25 },
      hostel_boys: { borderColor: 0x60A5FA, windowColor: 0xDBEAFE, doorColor: 0x1E40AF, shadowAlpha: 0.25 },
      landmark: { borderColor: 0xFACC15, windowColor: 0xFEF9C3, doorColor: 0x713F12, shadowAlpha: 0.3 },
      cafe: { borderColor: 0xFBBF24, windowColor: 0xFEF3C7, doorColor: 0x92400E, shadowAlpha: 0.25 },
      mess: { borderColor: 0xFCD34D, windowColor: 0xFEF9C3, doorColor: 0xA16207, shadowAlpha: 0.25 },
      sports: { borderColor: 0x34D399, windowColor: 0xD1FAE5, doorColor: 0x065F46, shadowAlpha: 0.25 },
      gate: { borderColor: 0x9CA3AF, windowColor: 0xE5E7EB, doorColor: 0x374151, shadowAlpha: 0.3 },
    },
    character: {
      color: 0x3B82F6,
      glowColor: 0x3B82F6,
      shadowAlpha: 0.3,
    },
    effects: {
      particles: { leaves: true, snow: false, fireflies: false, glitchRain: false },
      ambientGlow: false,
      treeSway: true,
      shadowsEnabled: true,
    },
    ui: {
      textColor: 0xFFFFFF,
      textShadow: 0x000000,
      accentColor: 0x22C55E,
      buttonBg: 0x374151,
    },
  },

  'cyberpunk-neon': {
    backgroundColor: 0x0A0A1A,
    terrain: {
      baseColor: 0x151530,
      variations: [0x151530, 0x1A1A40, 0x202055, 0x151528],
      gridColor: 0x00FFFF,
      gridAlpha: 0.12,
      textureIntensity: 0.1,
    },
    roads: {
      baseColor: 0x1A1A30,
      width: 28,
      markingColor: 0xFF00FF,
      borderColor: 0x00FFFF,
      glowColor: 0x00FFFF,
      glowAlpha: 0.3,
    },
    props: {
      density: { trees: 12, benches: 4, lanterns: 25 },
      treeColor: 0xBF00FF,
      treeTrunkColor: 0x4C1D95,
      treeHighlight: 0xFF00FF,
      benchColor: 0x3730A3,
      benchBorderColor: 0x6366F1,
      lanternColor: 0x00FFFF,
      lanternGlow: 0x00FFFF,
    },
    buildings: {
      default: { borderColor: 0x00FFFF, windowColor: 0xFF00FF, doorColor: 0x1A1A30, neonGlow: true },
      academic: { borderColor: 0x00FFFF, windowColor: 0x00D4FF, doorColor: 0x0F0F20, neonGlow: true },
      hostel: { borderColor: 0xFF00FF, windowColor: 0xFF69B4, doorColor: 0x2D0040, neonGlow: true },
      hostel_girls: { borderColor: 0xFF00FF, windowColor: 0xFF69B4, doorColor: 0x2D0040, neonGlow: true },
      hostel_boys: { borderColor: 0x00BFFF, windowColor: 0x00D4FF, doorColor: 0x002040, neonGlow: true },
      landmark: { borderColor: 0xFFFF00, windowColor: 0xFFFF00, doorColor: 0x3D3D00, neonGlow: true },
      cafe: { borderColor: 0xFF6600, windowColor: 0xFFAA00, doorColor: 0x331100, neonGlow: true },
      mess: { borderColor: 0xFFFF00, windowColor: 0xFFDD00, doorColor: 0x333300, neonGlow: true },
      sports: { borderColor: 0x00FF00, windowColor: 0x00FF88, doorColor: 0x003300, neonGlow: true },
      gate: { borderColor: 0x00FFFF, windowColor: 0x00DDFF, doorColor: 0x003333, neonGlow: true },
    },
    character: {
      color: 0x00FFFF,
      glowColor: 0xFF00FF,
      neonPulse: true,
    },
    effects: {
      particles: { leaves: false, snow: false, fireflies: false, glitchRain: true },
      ambientGlow: true,
      neonPulse: true,
      scanlines: false,
      chromatic: true,
    },
    ui: {
      textColor: 0x00FFFF,
      textShadow: 0xFF00FF,
      accentColor: 0xFF00FF,
      buttonBg: 0x1A1A40,
    },
  },

  'cozy-campus': {
    backgroundColor: 0x1C1612,
    terrain: {
      baseColor: 0x4A7C59,
      variations: [0x4A7C59, 0x5C8A4D, 0x6B9B5A, 0x3D6B4A, 0x557B4F],
      gridColor: 0x2D4A35,
      textureIntensity: 0.2,
    },
    roads: {
      baseColor: 0x8B7355,
      width: 24,
      markingColor: 0xD4C4A8,
      borderColor: 0x6B5344,
      cobblestone: true,
    },
    props: {
      density: { trees: 45, benches: 14, lanterns: 30 },
      treeColor: 0x6B8E4E,
      treeTrunkColor: 0x8B4513,
      treeHighlight: 0x98C379,
      benchColor: 0xB8860B,
      benchBorderColor: 0x8B6914,
      lanternColor: 0xFFD54F,
      lanternGlow: 0xFFB300,
      lanternFlicker: true,
    },
    buildings: {
      default: { borderColor: 0xD4A574, windowColor: 0xFFE4B5, doorColor: 0x78350F, warmGlow: true },
      academic: { borderColor: 0xC9A66B, windowColor: 0xFFF8DC, doorColor: 0x713F12, warmGlow: true },
      hostel: { borderColor: 0xCD853F, windowColor: 0xFFE4C4, doorColor: 0x92400E, warmGlow: true },
      hostel_girls: { borderColor: 0xDDA0DD, windowColor: 0xFFE4E1, doorColor: 0x8B4513, warmGlow: true },
      hostel_boys: { borderColor: 0x87CEEB, windowColor: 0xF0F8FF, doorColor: 0x6B4423, warmGlow: true },
      landmark: { borderColor: 0xDAA520, windowColor: 0xFFF8DC, doorColor: 0x78350F, warmGlow: true },
      cafe: { borderColor: 0xD2691E, windowColor: 0xFFE4B5, doorColor: 0x8B4513, warmGlow: true },
      mess: { borderColor: 0xF0C05A, windowColor: 0xFFF8DC, doorColor: 0xA0522D, warmGlow: true },
      sports: { borderColor: 0x8FBC8F, windowColor: 0xF0FFF0, doorColor: 0x556B2F, warmGlow: true },
      gate: { borderColor: 0xA0826D, windowColor: 0xFAF0E6, doorColor: 0x654321, warmGlow: true },
    },
    character: {
      color: 0xF59E0B,
      glowColor: 0xFDE047,
      warmTint: true,
    },
    effects: {
      particles: { leaves: true, snow: false, fireflies: true, glitchRain: false },
      ambientGlow: true,
      warmLighting: true,
      treeSway: true,
      lanternFlicker: true,
    },
    ui: {
      textColor: 0xFDE68A,
      textShadow: 0x3D2817,
      accentColor: 0xF59E0B,
      buttonBg: 0x3D2817,
    },
  },

  'pixel-retro': {
    backgroundColor: 0x2D1B69,
    terrain: {
      baseColor: 0x629460,
      variations: [0x629460, 0x739E73, 0x528A52, 0x7AB87A],
      gridColor: 0x3E5C3E,
      pixelPerfect: true,
    },
    roads: {
      baseColor: 0x8B7355,
      width: 32,
      markingColor: 0xFFD700,
      borderColor: 0x5C4D43,
      pixelBorder: 3,
    },
    props: {
      density: { trees: 25, benches: 8, lanterns: 10 },
      treeColor: 0x4A7C4A,
      treeTrunkColor: 0x8B6914,
      benchColor: 0xD2691E,
      benchBorderColor: 0x8B4513,
      pixelStyle: true,
    },
    buildings: {
      default: { borderColor: 0x000000, windowColor: 0x87CEEB, doorColor: 0x8B4513, pixelOutline: 3 },
      academic: { borderColor: 0x000000, windowColor: 0xADD8E6, doorColor: 0x4169E1, pixelOutline: 3 },
      hostel: { borderColor: 0x000000, windowColor: 0xFFB6C1, doorColor: 0xC71585, pixelOutline: 3 },
      hostel_girls: { borderColor: 0x000000, windowColor: 0xFFB6C1, doorColor: 0xDB7093, pixelOutline: 3 },
      hostel_boys: { borderColor: 0x000000, windowColor: 0xB0C4DE, doorColor: 0x4682B4, pixelOutline: 3 },
      landmark: { borderColor: 0x000000, windowColor: 0xFFD700, doorColor: 0xB8860B, pixelOutline: 3 },
      cafe: { borderColor: 0x000000, windowColor: 0xF4A460, doorColor: 0x8B4513, pixelOutline: 3 },
      mess: { borderColor: 0x000000, windowColor: 0xFFD700, doorColor: 0xDAA520, pixelOutline: 3 },
      sports: { borderColor: 0x000000, windowColor: 0x90EE90, doorColor: 0x228B22, pixelOutline: 3 },
      gate: { borderColor: 0x000000, windowColor: 0xA9A9A9, doorColor: 0x696969, pixelOutline: 3 },
    },
    character: {
      color: 0xFF6B6B,
      glowColor: 0xFFD700,
      pixelSize: 4,
    },
    effects: {
      particles: { leaves: false, snow: false, fireflies: false, glitchRain: false },
      ambientGlow: false,
      pixelPerfect: true,
      scanlines: true,
      crtCurve: false,
    },
    ui: {
      textColor: 0xFFFFFF,
      textShadow: 0x000000,
      accentColor: 0xFFD700,
      buttonBg: 0x4B0082,
      pixelFont: true,
    },
  },
};

// Seasonal modifiers
const seasonalModifiers = {
  spring: {
    treeColorMod: 0.1, // Brighter greens
    particleType: 'petals',
    ambientColor: 0xFFC0CB,
  },
  summer: {
    treeColorMod: 0,
    particleType: 'none',
    ambientColor: 0xFFFF00,
  },
  autumn: {
    treeColorMod: -0.1, // Orange/red tint
    particleType: 'leaves',
    ambientColor: 0xFFA500,
  },
  winter: {
    treeColorMod: -0.2, // Bare/grey
    particleType: 'snow',
    ambientColor: 0xADD8E6,
  },
};

/**
 * Get theme configuration by mode name
 * @param {string} mode - Theme mode name
 * @returns {object} Theme configuration object
 */
export const getThemeConfig = (mode) => {
  return themeConfigs[mode] || themeConfigs['nust-classic'];
};

/**
 * Get seasonal modifier
 * @param {string} season - Season name
 * @returns {object} Seasonal modifier object
 */
export const getSeasonalModifier = (season) => {
  return seasonalModifiers[season] || seasonalModifiers.summer;
};

/**
 * Apply seasonal modifier to a color
 * @param {number} baseColor - Base color (hex)
 * @param {string} season - Season name
 * @returns {number} Modified color
 */
export const applySeasonalColor = (baseColor, season) => {
  const mod = seasonalModifiers[season]?.treeColorMod || 0;
  
  // Extract RGB
  const r = (baseColor >> 16) & 0xFF;
  const g = (baseColor >> 8) & 0xFF;
  const b = baseColor & 0xFF;
  
  // Apply modifier (shift hue/saturation)
  let newR = r, newG = g, newB = b;
  
  if (season === 'autumn') {
    // Shift to orange/red
    newR = Math.min(255, r + 40);
    newG = Math.max(0, g - 30);
    newB = Math.max(0, b - 20);
  } else if (season === 'winter') {
    // Desaturate
    const avg = (r + g + b) / 3;
    newR = Math.round(r * 0.5 + avg * 0.5);
    newG = Math.round(g * 0.5 + avg * 0.5);
    newB = Math.round(b * 0.5 + avg * 0.5);
  } else if (season === 'spring') {
    // Brighter, more vibrant
    newG = Math.min(255, g + 20);
    newR = Math.min(255, r + 10);
  }
  
  return (newR << 16) | (newG << 8) | newB;
};

export default themeConfigs;
