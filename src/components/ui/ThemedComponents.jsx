import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { UserIcon } from './icons';

// Themed Panel Component
export const ThemedPanel = ({ children, className = '', style = {}, ...props }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`${className}`}
      style={{
        background: theme.ui.panels.background,
        border: theme.ui.panels.border,
        borderRadius: theme.ui.panels.borderRadius,
        boxShadow: theme.ui.panels.shadow,
        backdropFilter: theme.ui.panels.blur ? `blur(${theme.ui.panels.blur})` : undefined,
        ...style
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Themed Button Component
export const ThemedButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  const buttonStyle = theme.ui.buttons[variant] || theme.ui.buttons.primary;
  
  return (
    <motion.button
      className={`px-4 py-2 font-medium transition-all ${className}`}
      style={{
        background: buttonStyle.background,
        color: buttonStyle.text,
        borderRadius: buttonStyle.borderRadius,
        border: buttonStyle.border || 'none',
        fontFamily: theme.typography.fontFamily.body,
        ...style
      }}
      whileHover={{ 
        scale: buttonStyle.hover?.scale || 1.02,
        filter: buttonStyle.hover?.brightness ? `brightness(${buttonStyle.hover.brightness})` : undefined
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Themed Text Components
export const ThemedHeading = ({ 
  children, 
  level = 1, 
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  const Tag = `h${level}`;
  const sizes = ['3xl', '2xl', 'xl', 'lg', 'base', 'sm'];
  
  return (
    <Tag
      className={className}
      style={{
        fontFamily: theme.typography.fontFamily.heading,
        fontSize: theme.typography.sizes[sizes[level - 1]] || theme.typography.sizes.xl,
        color: theme.colorPalette.text.primary,
        ...(theme.typography.effects?.heading || {}),
        ...style
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};

export const ThemedText = ({ 
  children, 
  variant = 'primary', 
  size = 'base',
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <span
      className={className}
      style={{
        fontFamily: theme.typography.fontFamily.body,
        fontSize: theme.typography.sizes[size],
        color: theme.colorPalette.text[variant] || theme.colorPalette.text.primary,
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  );
};

// Themed Badge Component
export const ThemedBadge = ({ 
  children, 
  color,
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  const bgColor = color || theme.colorPalette.accent;
  
  return (
    <motion.span
      className={`inline-flex items-center px-2 py-1 text-sm font-medium ${className}`}
      style={{
        background: bgColor + '20',
        color: bgColor,
        borderRadius: theme.ui.badges?.style === 'rounded' ? '9999px' : 
                     theme.ui.badges?.style === 'hexagon' ? '4px' : '8px',
        boxShadow: theme.ui.badges?.glow ? `0 0 10px ${bgColor}50` : undefined,
        fontFamily: theme.typography.fontFamily.body,
        ...style
      }}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// Themed Input Component
export const ThemedInput = ({ 
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <input
      className={`w-full px-4 py-2 outline-none transition-all ${className}`}
      style={{
        background: theme.colorPalette.surface,
        color: theme.colorPalette.text.primary,
        border: `2px solid ${theme.colorPalette.primary}30`,
        borderRadius: theme.ui.panels.borderRadius,
        fontFamily: theme.typography.fontFamily.body,
        fontSize: theme.typography.sizes.base,
        ...style
      }}
      {...props}
    />
  );
};

// Themed Card Component
export const ThemedCard = ({ 
  children, 
  hoverable = true,
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      style={{
        background: theme.colorPalette.surface,
        border: theme.ui.panels.border,
        borderRadius: theme.ui.panels.borderRadius,
        boxShadow: theme.ui.panels.shadow,
        ...style
      }}
      whileHover={hoverable ? { 
        scale: 1.02,
        boxShadow: theme.ui.panels.shadow.replace('0.1', '0.2')
      } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Themed Progress Bar
export const ThemedProgress = ({ 
  value, 
  max = 100, 
  color,
  showLabel = true,
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  const progressColor = color || theme.colorPalette.xp;
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`relative ${className}`} {...props}>
      <div 
        className="h-3 rounded-full overflow-hidden"
        style={{
          background: theme.colorPalette.surface,
          border: `1px solid ${theme.colorPalette.primary}20`,
          ...style
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: progressColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span 
          className="absolute right-0 -top-5 text-xs"
          style={{ color: theme.colorPalette.text.muted }}
        >
          {value}/{max}
        </span>
      )}
    </div>
  );
};

// Themed Icon Button
export const ThemedIconButton = ({ 
  icon, 
  onClick,
  size = 'md',
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  const sizes = { sm: 32, md: 40, lg: 48 };
  
  return (
    <motion.button
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: sizes[size],
        height: sizes[size],
        background: theme.colorPalette.surface,
        border: `2px solid ${theme.colorPalette.primary}30`,
        color: theme.colorPalette.text.primary,
        ...style
      }}
      whileHover={{ 
        scale: 1.1,
        background: theme.colorPalette.primary + '20'
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      {...props}
    >
      {icon}
    </motion.button>
  );
};

// Themed Divider
export const ThemedDivider = ({ className = '', style = {} }) => {
  const { theme } = useTheme();
  
  return (
    <hr 
      className={className}
      style={{
        border: 'none',
        height: 1,
        background: theme.colorPalette.primary + '20',
        ...style
      }}
    />
  );
};

// Themed Avatar
export const ThemedAvatar = ({ 
  src, 
  alt = '', 
  size = 'md',
  className = '', 
  style = {},
  ...props 
}) => {
  const { theme } = useTheme();
  const sizes = { sm: 32, md: 48, lg: 64, xl: 96 };
  
  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{
        width: sizes[size],
        height: sizes[size],
        background: theme.colorPalette.primary + '30',
        border: `3px solid ${theme.colorPalette.primary}`,
        ...style
      }}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <UserIcon size={24} color={theme.colorPalette.primary} />
      )}
    </div>
  );
};

// Export all components
export default {
  ThemedPanel,
  ThemedButton,
  ThemedHeading,
  ThemedText,
  ThemedBadge,
  ThemedInput,
  ThemedCard,
  ThemedProgress,
  ThemedIconButton,
  ThemedDivider,
  ThemedAvatar
};
