/**
 * Professional UI Icons - SVG-based icon components
 * Replaces emojis with clean, scalable vector icons
 * Theme-aware and accessible
 */

import { memo } from 'react';

// ============================================
// PERSONALITY TYPE ICONS
// ============================================

export const IntrovertIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7h8M8 11h6M8 15h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
));

export const ExtrovertIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="10" r="1" fill={color}/>
    <circle cx="15" cy="10" r="1" fill={color}/>
  </svg>
));

export const BookwormIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="5" stroke={color} strokeWidth="2"/>
    <path d="M5 19c0-2.5 3-4 7-4s7 1.5 7 4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <rect x="9" y="6" width="6" height="4" rx="1" stroke={color} strokeWidth="1.5"/>
    <line x1="9" y1="8" x2="15" y2="8" stroke={color} strokeWidth="1.5"/>
  </svg>
));

export const AdventurerIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="2"/>
    <path d="M3 21h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const GamerIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="3" stroke={color} strokeWidth="2"/>
    <circle cx="8" cy="12" r="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="16" cy="10" r="1" fill={color}/>
    <circle cx="16" cy="14" r="1" fill={color}/>
    <circle cx="14" cy="12" r="1" fill={color}/>
    <circle cx="18" cy="12" r="1" fill={color}/>
  </svg>
));

export const ExplorerIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" fill={color}/>
  </svg>
));

export const CreatorIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 6v6M9 9h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const SocialiteIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="3" stroke={color} strokeWidth="2"/>
    <path d="M21 21v-2a3 3 0 00-3-3h-1" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const AchieverIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" stroke={color} strokeWidth="2"/>
    <path d="M18 9h1.5a2.5 2.5 0 000-5H18" stroke={color} strokeWidth="2"/>
    <rect x="6" y="4" width="12" height="10" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M12 14v4M8 22h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 8l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

// ============================================
// BADGE & ACHIEVEMENT ICONS
// ============================================

export const FirstStepsIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 22c1.5-2 3-4 3-6.5C15 13 13.5 11 12 11s-3 2-3 4.5c0 2.5 1.5 4.5 3 6.5z" stroke={color} strokeWidth="2"/>
    <path d="M8 14c-1 1.5-1.5 3-1 4.5.5 1.5 2 2.5 3 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 14c1 1.5 1.5 3 1 4.5-.5 1.5-2 2.5-3 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="6" r="4" stroke={color} strokeWidth="2"/>
  </svg>
));

export const SocialButterflyIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 12c3-3 6-3 8 0-2 3-5 3-8 0z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12c-3-3-6-3-8 0 2 3 5 3 8 0z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12c3 3 6 3 8 0-2-3-5-3-8 0z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 12c-3 3-6 3-8 0 2-3 5-3 8 0z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
  </svg>
));

export const EarlyBirdIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3v1M12 20v1M4.22 4.22l.7.7M18.36 18.36l.7.7M1 12h1M22 12h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2"/>
    <path d="M12 9v3l2 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

export const QuizMasterIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2a9 9 0 0 0-9 9c0 3.5 2 6.5 5 8v3h8v-3c3-1.5 5-4.5 5-8a9 9 0 0 0-9-9z" stroke={color} strokeWidth="2"/>
    <path d="M9 22h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 8v4M12 15h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

// ============================================
// CATEGORY ICONS (Clubs, Events)
// ============================================

export const AcademicIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M22 10l-10-6-10 6 10 6 10-6z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M6 12v5c0 2 3 4 6 4s6-2 6-4v-5" stroke={color} strokeWidth="2"/>
    <path d="M22 10v6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const CulturalIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="5" stroke={color} strokeWidth="2"/>
    <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" stroke={color} strokeWidth="2"/>
    <path d="M9 7c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" stroke={color} strokeWidth="1.5"/>
    <path d="M9 9h1.5M13.5 9H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
));

export const SportsIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M12 2c-1.5 2-2.5 5-2.5 10s1 8 2.5 10" stroke={color} strokeWidth="1.5"/>
    <path d="M12 2c1.5 2 2.5 5 2.5 10s-1 8-2.5 10" stroke={color} strokeWidth="1.5"/>
    <path d="M2 12h20" stroke={color} strokeWidth="1.5"/>
    <path d="M4 7h16M4 17h16" stroke={color} strokeWidth="1.5"/>
  </svg>
));

export const TechIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="3" width="20" height="14" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M8 21h8M12 17v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 8l3 3-3 3M12 14h5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

export const SocialIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <path d="M3 21v-2c0-2.5 2.5-4 6-4s6 1.5 6 4v2" stroke={color} strokeWidth="2"/>
    <circle cx="17" cy="8" r="3" stroke={color} strokeWidth="2"/>
    <path d="M21 21v-1.5c0-1.5-1.5-2.5-4-3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const WorkshopIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2"/>
  </svg>
));

export const SeminarIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="14" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M7 22l5-4 5 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
  </svg>
));

export const CompetitionIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 21h8M12 17v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 4h10v4c0 3-2 5-5 5s-5-2-5-5V4z" stroke={color} strokeWidth="2"/>
    <path d="M7 8H4c0 3 1.5 5 3 5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 8h3c0 3-1.5 5-3 5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 4V2h10v2" stroke={color} strokeWidth="2"/>
  </svg>
));

// ============================================
// THEME MOOD ICONS
// ============================================

export const ProfessionalIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M22 10l-10-6-10 6 10 6 10-6z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M6 12v5c0 2 3 4 6 4s6-2 6-4v-5" stroke={color} strokeWidth="2"/>
    <path d="M12 10v11" stroke={color} strokeWidth="2"/>
  </svg>
));

export const FuturisticIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 22V12M4 7l8 5M20 7l-8 5" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
  </svg>
));

export const RelaxingIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke={color} strokeWidth="2"/>
    <path d="M5 8h13v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z" stroke={color} strokeWidth="2"/>
    <path d="M6 1v3M10 1v3M14 1v3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const NostalgicIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2"/>
    <circle cx="8" cy="12" r="2" stroke={color} strokeWidth="1.5"/>
    <path d="M14 10h2M14 14h2M18 12h2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

// ============================================
// UI STATE ICONS
// ============================================

export const LockIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="16" r="1" fill={color}/>
  </svg>
));

export const CheckIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

export const SpinnerIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" opacity="0.25"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

// ============================================
// GAME HUD ICONS
// ============================================

export const CoinIcon = memo(({ size = 24, color = '#F59E0B', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5"/>
    <path d="M12 8v8M10 10h4M10 14h4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
));

export const StarIcon = memo(({ size = 24, color = '#FBBF24', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
  </svg>
));

// XP Star - filled variant for XP display
export const XPStarIcon = memo(({ size = 24, color = '#FBBF24', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
));

// Gamepad icon for loading/gaming states
export const GamepadIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="3" stroke={color} strokeWidth="2"/>
    <circle cx="8" cy="12" r="2" stroke={color} strokeWidth="1.5"/>
    <circle cx="16" cy="10" r="1" fill={color}/>
    <circle cx="16" cy="14" r="1" fill={color}/>
    <circle cx="14" cy="12" r="1" fill={color}/>
    <circle cx="18" cy="12" r="1" fill={color}/>
  </svg>
));

export const HeartIcon = memo(({ size = 24, color = '#EF4444', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="2"/>
  </svg>
));

export const UserIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const UsersIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <path d="M3 21v-2c0-2.5 2.5-4 6-4s6 1.5 6 4v2" stroke={color} strokeWidth="2"/>
    <circle cx="17" cy="8" r="3" stroke={color} strokeWidth="2"/>
    <path d="M21 21v-1.5c0-1.5-1.5-2.5-4-3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const CalendarIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const LocationIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="2"/>
  </svg>
));

export const CommentIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke={color} strokeWidth="2"/>
    <path d="M8 9h8M8 13h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const MaskIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3C8 3 4 6 4 10c0 2 1 4 3 5l2 6h6l2-6c2-1 3-3 3-5 0-4-4-7-8-7z" stroke={color} strokeWidth="2"/>
    <circle cx="9" cy="10" r="1.5" fill={color}/>
    <circle cx="15" cy="10" r="1.5" fill={color}/>
    <path d="M10 14h4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const EditIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2"/>
  </svg>
));

export const TrophyIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M8 21h8M12 17v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 3H7v7c0 3 2 5 5 5s5-2 5-5V3z" stroke={color} strokeWidth="2"/>
    <path d="M7 7H4c0 3 1.5 5 3 5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 7h3c0 3-1.5 5-3 5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

// Rank medals
export const GoldMedalIcon = memo(({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="14" r="7" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
    <path d="M12 3L10 8h4L12 3z" fill="#F59E0B"/>
    <path d="M9 3l-2 5h2.5L12 3H9z" fill="#EAB308"/>
    <path d="M15 3l2 5h-2.5L12 3h3z" fill="#EAB308"/>
    <text x="12" y="17" textAnchor="middle" fill="#78350F" fontSize="8" fontWeight="bold">1</text>
  </svg>
));

export const SilverMedalIcon = memo(({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="14" r="7" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1"/>
    <path d="M12 3L10 8h4L12 3z" fill="#9CA3AF"/>
    <path d="M9 3l-2 5h2.5L12 3H9z" fill="#D1D5DB"/>
    <path d="M15 3l2 5h-2.5L12 3h3z" fill="#D1D5DB"/>
    <text x="12" y="17" textAnchor="middle" fill="#374151" fontSize="8" fontWeight="bold">2</text>
  </svg>
));

export const BronzeMedalIcon = memo(({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="14" r="7" fill="#D97706" stroke="#B45309" strokeWidth="1"/>
    <path d="M12 3L10 8h4L12 3z" fill="#D97706"/>
    <path d="M9 3l-2 5h2.5L12 3H9z" fill="#F59E0B"/>
    <path d="M15 3l2 5h-2.5L12 3h3z" fill="#F59E0B"/>
    <text x="12" y="17" textAnchor="middle" fill="#78350F" fontSize="8" fontWeight="bold">3</text>
  </svg>
));

export const ClubIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 21h18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 21V7l7-4 7 4v14" stroke={color} strokeWidth="2"/>
    <path d="M9 21v-6h6v6" stroke={color} strokeWidth="2"/>
    <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const PostIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke={color} strokeWidth="2"/>
    <path d="M14 2v6h6M8 13h8M8 17h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

export const CloseIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

// ============================================
// REACTION ICONS (for Feed)
// ============================================

export const ThumbsUpIcon = memo(({ size = 24, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke={color} strokeWidth="2"/>
  </svg>
));

export const HeartFilledIcon = memo(({ size = 24, color = '#EF4444', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={color}/>
  </svg>
));

export const LaughIcon = memo(({ size = 24, color = '#FBBF24', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 9h.01M15 9h.01" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
));

export const WowIcon = memo(({ size = 24, color = '#F97316', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="15" r="2" stroke={color} strokeWidth="2"/>
    <circle cx="9" cy="9" r="1" fill={color}/>
    <circle cx="15" cy="9" r="1" fill={color}/>
  </svg>
));

export const SadIcon = memo(({ size = 24, color = '#3B82F6', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="9" r="1" fill={color}/>
    <circle cx="15" cy="9" r="1" fill={color}/>
  </svg>
));

export const AngryIcon = memo(({ size = 24, color = '#EF4444', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 8l3 2M17 8l-3 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
));

// ============================================
// ICON MAP - For easy lookup
// ============================================

export const PERSONALITY_ICONS = {
  introvert: IntrovertIcon,
  extrovert: ExtrovertIcon,
  bookworm: BookwormIcon,
  adventurer: AdventurerIcon,
  gamer: GamerIcon,
  explorer: ExplorerIcon,
};

export const BADGE_ICONS = {
  'First Steps': FirstStepsIcon,
  'Bookworm': IntrovertIcon,
  'Social Butterfly': SocialButterflyIcon,
  'Early Bird': EarlyBirdIcon,
  'Explorer': AdventurerIcon,
  'Quiz Master': QuizMasterIcon,
};

export const CATEGORY_ICONS = {
  academic: AcademicIcon,
  cultural: CulturalIcon,
  sports: SportsIcon,
  tech: TechIcon,
  social: SocialIcon,
  workshop: WorkshopIcon,
  seminar: SeminarIcon,
  competition: CompetitionIcon,
};

export const EVENT_ICONS = {
  competition: CompetitionIcon,
  social: ExtrovertIcon,
  sports: SportsIcon,
  cultural: CulturalIcon,
  workshop: WorkshopIcon,
  seminar: SeminarIcon,
};

export const THEME_ICONS = {
  professional: ProfessionalIcon,
  futuristic: FuturisticIcon,
  relaxing: RelaxingIcon,
  nostalgic: NostalgicIcon,
};

export const REACTION_ICONS = [
  { icon: ThumbsUpIcon, label: 'Like', color: '#3B82F6' },
  { icon: HeartFilledIcon, label: 'Love', color: '#EF4444' },
  { icon: LaughIcon, label: 'Haha', color: '#FBBF24' },
  { icon: WowIcon, label: 'Wow', color: '#F97316' },
  { icon: SadIcon, label: 'Sad', color: '#3B82F6' },
  { icon: AngryIcon, label: 'Angry', color: '#EF4444' },
];
