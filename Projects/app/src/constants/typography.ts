// Tipografi sistemi - Inter fontu ile
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  fontWeight: {
    normal: 'normal' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

export const TEXT_STYLES = {
  h1: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    lineHeight: TYPOGRAPHY.fontSize['4xl'] * TYPOGRAPHY.lineHeight.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  h2: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    lineHeight: TYPOGRAPHY.fontSize['3xl'] * TYPOGRAPHY.lineHeight.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  h3: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    lineHeight: TYPOGRAPHY.fontSize['2xl'] * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.xl,
    lineHeight: TYPOGRAPHY.fontSize.xl * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  body: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
  },
  caption: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.relaxed,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
  },
  button: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  score: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.fontSize['5xl'],
    lineHeight: TYPOGRAPHY.fontSize['5xl'] * TYPOGRAPHY.lineHeight.tight,
    letterSpacing: TYPOGRAPHY.letterSpacing.tight,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  stat: {
    fontFamily: TYPOGRAPHY.fontFamily.semiBold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.normal,
    letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
};

// Pastel Renk Paleti - DEHB Dostu
export const COLORS = {
  // Ana Pastel Renkler
  primary: {
    50: '#F0F8FF',   // Çok açık mavi
    100: '#E6F3FF',  // Açık mavi
    200: '#CCE7FF',  // Pastel mavi
    300: '#B3DBFF',  // Orta pastel mavi
    400: '#99CFFF',  // Pastel mavi
    500: '#80C3FF',  // Ana pastel mavi
    600: '#66B7FF',  // Koyu pastel mavi
    700: '#4DABFF',  // Daha koyu mavi
    800: '#339FFF',  // Koyu mavi
    900: '#1A93FF',  // En koyu mavi
  },

  // Pastel Yeşil
  success: {
    50: '#F0FFF4',   // Çok açık yeşil
    100: '#E6FFED',  // Açık yeşil
    200: '#CCFFDB',  // Pastel yeşil
    300: '#B3FFC9',  // Orta pastel yeşil
    400: '#99FFB7',  // Pastel yeşil
    500: '#80FFA5',  // Ana pastel yeşil
    600: '#66FF93',  // Koyu pastel yeşil
    700: '#4DFF81',  // Daha koyu yeşil
    800: '#33FF6F',  // Koyu yeşil
    900: '#1AFF5D',  // En koyu yeşil
  },

  // Pastel Turuncu
  warning: {
    50: '#FFF8F0',   // Çok açık turuncu
    100: '#FFF3E6',  // Açık turuncu
    200: '#FFE7CC',  // Pastel turuncu
    300: '#FFDBB3',  // Orta pastel turuncu
    400: '#FFCF99',  // Pastel turuncu
    500: '#FFC380',  // Ana pastel turuncu
    600: '#FFB766',  // Koyu pastel turuncu
    700: '#FFAB4D',  // Daha koyu turuncu
    800: '#FF9F33',  // Koyu turuncu
    900: '#FF931A',  // En koyu turuncu
  },

  // Pastel Pembe
  error: {
    50: '#FFF0F8',   // Çok açık pembe
    100: '#FFE6F3',  // Açık pembe
    200: '#FFCCE7',  // Pastel pembe
    300: '#FFB3DB',  // Orta pastel pembe
    400: '#FF99CF',  // Pastel pembe
    500: '#FF80C3',  // Ana pastel pembe
    600: '#FF66B7',  // Koyu pastel pembe
    700: '#FF4DAB',  // Daha koyu pembe
    800: '#FF339F',  // Koyu pembe
    900: '#FF1A93',  // En koyu pembe
  },

  // Pastel Mor
  info: {
    50: '#F8F0FF',   // Çok açık mor
    100: '#F3E6FF',  // Açık mor
    200: '#E7CCFF',  // Pastel mor
    300: '#DBB3FF',  // Orta pastel mor
    400: '#CF99FF',  // Pastel mor
    500: '#C380FF',  // Ana pastel mor
    600: '#B766FF',  // Koyu pastel mor
    700: '#AB4DFF',  // Daha koyu mor
    800: '#9F33FF',  // Koyu mor
    900: '#931AFF',  // En koyu mor
  },

  // Nötr Renkler (Sıcak Gri Tonları)
  neutral: {
    50: '#FAFAFA',   // Çok açık gri
    100: '#F5F5F5',  // Açık gri
    200: '#EEEEEE',  // Pastel gri
    300: '#E0E0E0',  // Orta açık gri
    400: '#BDBDBD',  // Orta gri
    500: '#9E9E9E',  // Orta koyu gri
    600: '#757575',  // Koyu gri
    700: '#616161',  // Daha koyu gri
    800: '#424242',  // Çok koyu gri
    900: '#212121',  // En koyu gri
  },

  // Metin Renkleri
  text: {
    primary: '#2C3E50',    // Koyu lacivert (göz yormuyor)
    secondary: '#7F8C8D',  // Orta gri
    tertiary: '#BDC3C7',   // Açık gri
    inverse: '#FFFFFF',     // Beyaz
  },

  // Durum Renkleri (Pastel)
  status: {
    success: '#80FFA5',    // Pastel yeşil
    warning: '#FFC380',    // Pastel turuncu
    error: '#FF80C3',      // Pastel pembe
    info: '#C380FF',       // Pastel mor
  },

  // Arka Plan Renkleri
  background: {
    primary: '#FFFFFF',    // Beyaz
    secondary: '#F8F9FA',  // Çok açık gri
    tertiary: '#F1F3F4',  // Açık gri
    card: '#FFFFFF',       // Beyaz
  },

  // Gölge Renkleri (Yumuşak)
  shadow: {
    light: 'rgba(44, 62, 80, 0.05)',    // Çok hafif gölge
    medium: 'rgba(44, 62, 80, 0.1)',    // Orta gölge
    dark: 'rgba(44, 62, 80, 0.15)',     // Koyu gölge
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
}; 