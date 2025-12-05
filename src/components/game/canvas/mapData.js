/**
 * Map Data Configuration
 * Contains all campus locations, roads, collectibles, and minigames
 * Updated: Using iconType references instead of emojis for professional graphics
 */

// Map configuration
export const MAP_CONFIG = {
  mapWidth: 2300,
  mapHeight: 1000,
  tileSize: 40,
  buildingSize: 70,
  viewportPadding: 100,
};

// Campus buildings and locations
export const CAMPUS_DATA = {
  academic_blocks: [
    { id: 'seecs', name: 'SEECS', type: 'academic', iconType: 'academic', color: '#3B82F6', coordinates: { x: 400, y: 200 }, description: 'School of Electrical Engineering & Computer Science' },
    { id: 'sada', name: 'SADA', type: 'academic', iconType: 'academic', color: '#EC4899', coordinates: { x: 600, y: 200 }, description: 'School of Art, Design & Architecture' },
    { id: 'smme', name: 'SMME', type: 'academic', iconType: 'academic', color: '#F59E0B', coordinates: { x: 800, y: 200 }, description: 'School of Mechanical & Manufacturing Engineering' },
    { id: 'scme', name: 'SCME', type: 'academic', iconType: 'academic', color: '#10B981', coordinates: { x: 1000, y: 200 }, description: 'School of Chemical & Materials Engineering' },
    { id: 'nice', name: 'NICE', type: 'academic', iconType: 'academic', color: '#6366F1', coordinates: { x: 1200, y: 200 }, description: 'NUST Institute of Civil Engineering' },
    { id: 'sns', name: 'SNS', type: 'academic', iconType: 'academic', color: '#8B5CF6', coordinates: { x: 1400, y: 200 }, description: 'School of Natural Sciences' },
    { id: 'nbs', name: 'NBS', type: 'academic', iconType: 'academic', color: '#14B8A6', coordinates: { x: 1600, y: 200 }, description: 'NUST Business School' },
    { id: 's3h', name: 'S3H', type: 'academic', iconType: 'academic', color: '#F97316', coordinates: { x: 1800, y: 200 }, description: 'School of Social Sciences & Humanities' },
  ],
  hostels_girls: [
    { id: 'qh', name: 'Qasim Hall', type: 'hostel_girls', iconType: 'hostel_girls', color: '#F472B6', coordinates: { x: 300, y: 600 } },
    { id: 'fh', name: 'Fatima Hall', type: 'hostel_girls', iconType: 'hostel_girls', color: '#F472B6', coordinates: { x: 450, y: 600 } },
    { id: 'zh', name: 'Zainab Hall', type: 'hostel_girls', iconType: 'hostel_girls', color: '#F472B6', coordinates: { x: 600, y: 600 } },
  ],
  hostels_boys: [
    { id: 'gh', name: 'Ghazali Hall', type: 'hostel_boys', iconType: 'hostel_boys', color: '#60A5FA', coordinates: { x: 1500, y: 600 } },
    { id: 'ih', name: 'Iqbal Hall', type: 'hostel_boys', iconType: 'hostel_boys', color: '#60A5FA', coordinates: { x: 1650, y: 600 } },
    { id: 'rh', name: 'Razi Hall', type: 'hostel_boys', iconType: 'hostel_boys', color: '#60A5FA', coordinates: { x: 1800, y: 600 } },
    { id: 'lh', name: 'Liaquat Hall', type: 'hostel_boys', iconType: 'hostel_boys', color: '#60A5FA', coordinates: { x: 1950, y: 600 } },
    { id: 'jh', name: 'Jinnah Hall', type: 'hostel_boys', iconType: 'hostel_boys', color: '#60A5FA', coordinates: { x: 2100, y: 600 } },
  ],
  mess_blocks: [
    { id: 'c1mess', name: 'C1 Mess', type: 'mess', iconType: 'mess', color: '#FCD34D', coordinates: { x: 500, y: 800 } },
    { id: 'c2mess', name: 'C2 Mess', type: 'mess', iconType: 'mess', color: '#FCD34D', coordinates: { x: 1700, y: 800 } },
  ],
  cafes: [
    { id: 'concordia', name: 'Concordia', type: 'cafe', iconType: 'cafe', color: '#92400E', coordinates: { x: 1100, y: 400 }, description: 'Popular campus cafe' },
    { id: 'lahtaq', name: 'Lah Taq', type: 'cafe', iconType: 'cafe', color: '#DC2626', coordinates: { x: 900, y: 400 }, description: 'Famous for pizza and fast food' },
  ],
  sports_areas: [
    { id: 'sports_complex', name: 'Sports Complex', type: 'sports', iconType: 'sports', color: '#059669', coordinates: { x: 1100, y: 700 }, description: 'Main sports facility' },
    { id: 'cricket_ground', name: 'Cricket Ground', type: 'sports', iconType: 'sports', color: '#15803D', coordinates: { x: 850, y: 800 }, description: 'Cricket ground' },
    { id: 'football_ground', name: 'Football Ground', type: 'sports', iconType: 'sports', color: '#16A34A', coordinates: { x: 1350, y: 800 }, description: 'Football field' },
  ],
  central_landmarks: [
    { id: 'library', name: 'Central Library', type: 'landmark', iconType: 'landmark', color: '#7C3AED', coordinates: { x: 1100, y: 200 }, description: 'Main campus library' },
    { id: 'masjid', name: 'Masjid', type: 'landmark', iconType: 'landmark', color: '#0D9488', coordinates: { x: 1100, y: 500 }, description: 'Campus mosque' },
    { id: 'admin', name: 'Admin Block', type: 'landmark', iconType: 'landmark', color: '#1E40AF', coordinates: { x: 700, y: 400 }, description: 'Administrative offices' },
    { id: 'auditorium', name: 'Auditorium', type: 'landmark', iconType: 'landmark', color: '#BE185D', coordinates: { x: 1300, y: 400 }, description: 'Events and seminars' },
  ],
  gates: [
    { id: 'main_gate', name: 'Main Gate', type: 'gate', iconType: 'gate', color: '#475569', coordinates: { x: 100, y: 500 } },
    { id: 'back_gate', name: 'Back Gate', type: 'gate', iconType: 'gate', color: '#475569', coordinates: { x: 2200, y: 500 } },
  ],
};

// Roads connecting buildings
export const ROADS = [
  // Main horizontal road
  { from: { x: 100, y: 500 }, to: { x: 2200, y: 500 }, type: 'main' },
  
  // Top horizontal (academic area)
  { from: { x: 300, y: 200 }, to: { x: 1900, y: 200 }, type: 'main' },
  
  // Vertical connectors
  { from: { x: 400, y: 200 }, to: { x: 400, y: 600 }, type: 'secondary' },
  { from: { x: 600, y: 200 }, to: { x: 600, y: 600 }, type: 'secondary' },
  { from: { x: 1100, y: 200 }, to: { x: 1100, y: 800 }, type: 'main' },
  { from: { x: 1500, y: 200 }, to: { x: 1500, y: 600 }, type: 'secondary' },
  { from: { x: 1800, y: 200 }, to: { x: 1800, y: 600 }, type: 'secondary' },
  
  // Hostel area connections
  { from: { x: 300, y: 600 }, to: { x: 700, y: 600 }, type: 'secondary' },
  { from: { x: 1400, y: 600 }, to: { x: 2100, y: 600 }, type: 'secondary' },
  
  // Sports area
  { from: { x: 850, y: 700 }, to: { x: 1350, y: 700 }, type: 'secondary' },
  { from: { x: 1100, y: 700 }, to: { x: 1100, y: 500 }, type: 'secondary' },
  
  // Mess connections
  { from: { x: 500, y: 600 }, to: { x: 500, y: 800 }, type: 'path' },
  { from: { x: 1700, y: 600 }, to: { x: 1700, y: 800 }, type: 'path' },
  
  // Cafe area
  { from: { x: 900, y: 400 }, to: { x: 1100, y: 400 }, type: 'path' },
  { from: { x: 900, y: 200 }, to: { x: 900, y: 500 }, type: 'secondary' },
  { from: { x: 1300, y: 200 }, to: { x: 1300, y: 500 }, type: 'secondary' },
];

// Collectible coins scattered across map
export const COLLECTIBLES = [
  { id: 'coin_1', type: 'coin', value: 10, coordinates: { x: 250, y: 350 } },
  { id: 'coin_2', type: 'coin', value: 10, coordinates: { x: 550, y: 450 } },
  { id: 'coin_3', type: 'coin', value: 10, coordinates: { x: 750, y: 350 } },
  { id: 'coin_4', type: 'coin', value: 10, coordinates: { x: 950, y: 550 } },
  { id: 'coin_5', type: 'coin', value: 20, coordinates: { x: 1100, y: 650 } },
  { id: 'coin_6', type: 'coin', value: 10, coordinates: { x: 1250, y: 350 } },
  { id: 'coin_7', type: 'coin', value: 10, coordinates: { x: 1450, y: 450 } },
  { id: 'coin_8', type: 'coin', value: 10, coordinates: { x: 1650, y: 350 } },
  { id: 'coin_9', type: 'coin', value: 10, coordinates: { x: 1850, y: 450 } },
  { id: 'coin_10', type: 'coin', value: 25, coordinates: { x: 2050, y: 550 } },
  { id: 'coin_11', type: 'xp', value: 50, coordinates: { x: 700, y: 700 } },
  { id: 'coin_12', type: 'xp', value: 50, coordinates: { x: 1500, y: 700 } },
];

// Minigame spawn locations (using iconType for vector graphics)
export const MINIGAME_MARKERS = [
  { id: 'mg_trivia', type: 'trivia', name: 'Quiz Zone', coordinates: { x: 1100, y: 280 }, description: 'Test your NUST knowledge!' },
  { id: 'mg_memory', type: 'memory', name: 'Memory Match', coordinates: { x: 500, y: 500 }, description: 'Match the cards!' },
  { id: 'mg_race', type: 'race', name: 'Speed Run', coordinates: { x: 1100, y: 750 }, description: 'Race against time!' },
  { id: 'mg_catch', type: 'catch', name: 'Catch Game', coordinates: { x: 1700, y: 500 }, description: 'Catch falling items!' },
];

// NPC spawn configurations
export const NPC_CONFIG = {
  wandering: [
    { id: 'npc_1', name: 'Student 1', color: '#3B82F6', path: [{ x: 400, y: 300 }, { x: 400, y: 500 }, { x: 600, y: 500 }, { x: 600, y: 300 }] },
    { id: 'npc_2', name: 'Student 2', color: '#EC4899', path: [{ x: 1100, y: 300 }, { x: 1100, y: 600 }, { x: 1300, y: 600 }, { x: 1300, y: 300 }] },
    { id: 'npc_3', name: 'Professor', color: '#F59E0B', path: [{ x: 800, y: 200 }, { x: 1000, y: 200 }, { x: 1000, y: 400 }, { x: 800, y: 400 }] },
  ],
  stationary: [
    { id: 'npc_guard', name: 'Guard', color: '#64748B', coordinates: { x: 120, y: 500 }, direction: 'right' },
    { id: 'npc_librarian', name: 'Librarian', color: '#7C3AED', coordinates: { x: 1100, y: 230 }, direction: 'down' },
  ],
};
