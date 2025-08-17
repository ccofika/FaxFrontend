// Design Reference File - FAXit App
// Based on Home.module.css analysis

export const designTokens = {
  // Color Palette
  colors: {
    // Background Colors
    bgPrimary: '#0B0D11',
    bgSecondary: '#101318', 
    bgTertiary: '#151922',
    bgInput: '#1A1F2E',
    bgCard: '#161B26',
    bgSidebar: '#0A0C0F',
    bgElevated: '#1C212B',

    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#B8BCC8',
    textMuted: '#6B7280',
    textPlaceholder: '#4B5563',
    textAccent: '#35577D',

    // Border Colors
    borderPrimary: '#2A2F3A',
    borderSecondary: '#1E232D',
    borderFocus: '#35577D',
    borderSubtle: '#252A35',

    // Interactive States
    hoverBg: '#1E2329',
    activeBg: '#35577D',
    activeBgSubtle: 'rgba(53, 87, 125, 0.1)',
    focusRing: 'rgba(53, 87, 125, 0.3)',

    // Accent Colors
    accentBlue: '#35577D',
    accentBlueBright: '#4A6FA5',
    accentSuccess: '#10B981',
    accentWarning: '#F59E0B',
    accentError: '#EF4444',

    // Chat Mode Colors
    modeExplain: '#35577D',
    modeSolve: '#F59E0B',
    modeSummary: '#10B981',
    modeTests: '#EF4444',
    modeLearning: '#3B82F6'
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #35577D 0%, #2A4A6B 25%, #1F3A57 50%, #1A2E47 75%, #141E30 100%)',
    primarySubtle: 'linear-gradient(135deg, rgba(53, 87, 125, 0.1) 0%, rgba(20, 30, 48, 0.05) 100%)',
    avatar: 'linear-gradient(135deg, #35577D 0%, #4A6FA5 30%, #5D7FC7 60%, #6B8DD6 100%)'
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFeatures: '"cv02", "cv03", "cv04", "cv11"',
    sizes: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '48px',
      '5xl': '72px'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },

  // Spacing Scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '60px',
    '6xl': '80px'
  },

  // Border Radius
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(53, 87, 125, 0.2)',
    md: '0 4px 12px rgba(53, 87, 125, 0.3)',
    lg: '0 8px 32px rgba(53, 87, 125, 0.15)',
    xl: '0 12px 32px rgba(0, 0, 0, 0.2)',
    '2xl': '0 20px 60px rgba(0, 0, 0, 0.5)'
  },

  // Animation Timing
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease'
  },

  // Component Specific
  components: {
    chatBubble: {
      maxWidth: '80%',
      padding: '12px 16px',
      marginBottom: '12px',
      borderRadius: '16px'
    },
    inputContainer: {
      minHeight: '56px',
      borderRadius: '20px',
      padding: '16px 24px'
    },
    messageInput: {
      minHeight: '44px',
      maxHeight: '200px',
      fontSize: '16px',
      lineHeight: '1.5'
    }
  },

  // Breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  }
} as const;

// Message Bubble Styles
export const messageBubbleStyles = {
  user: {
    backgroundColor: designTokens.colors.accentBlue,
    color: '#FFFFFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '6px'
  },
  bot: {
    backgroundColor: designTokens.colors.bgCard,
    color: designTokens.colors.textPrimary,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '6px',
    border: `1px solid ${designTokens.colors.borderPrimary}`
  }
} as const;

// Chat Layout
export const chatLayout = {
  header: {
    height: '64px',
    padding: '0 24px',
    borderBottom: `1px solid ${designTokens.colors.borderSecondary}`
  },
  messagesArea: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px'
  },
  inputArea: {
    padding: '16px 24px',
    borderTop: `1px solid ${designTokens.colors.borderSecondary}`,
    backgroundColor: designTokens.colors.bgSecondary
  }
} as const;