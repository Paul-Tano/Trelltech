import { TextStyle, ViewStyle } from "react-native";

/**
 * Design tokens TrellTech.
 * Toutes les couleurs de texte respectent un contraste WCAG AA (≥ 4.5:1)
 * sur `background`, `surface` et `surfaceMuted`, dans les deux thèmes.
 */
const lightColors = {
  background: "#F5F6FA",
  surface: "#FFFFFF",
  surfaceMuted: "#EEF0F6",
  border: "#E3E5EE",
  text: "#15142B",
  textMuted: "#5C5E78",
  textSubtle: "#62647D",
  primary: "#5B3DF5",
  primaryPressed: "#4A2EE0",
  primarySoft: "#EEEAFF",
  onPrimary: "#FFFFFF",
  danger: "#C8341F",
  dangerSoft: "#FDECEA",
  success: "#0B7A45",
  successSoft: "#E3F6EC",
  warning: "#8F5400",
  warningSoft: "#FFF3DC",
  overlay: "rgba(13,13,20,0.45)",
  shadow: "#1B1640",
};

export type ThemeColors = typeof lightColors;

const darkColors: ThemeColors = {
  background: "#0D0D14",
  surface: "#17171F",
  surfaceMuted: "#21212C",
  border: "#2C2C3A",
  text: "#F3F3F8",
  textMuted: "#A6A7BC",
  textSubtle: "#8C8DA3",
  primary: "#9A8AFF",
  primaryPressed: "#8573FF",
  primarySoft: "#26214A",
  onPrimary: "#0D0D14",
  danger: "#F47A6A",
  dangerSoft: "#3A1A17",
  success: "#4CC38A",
  successSoft: "#13301F",
  warning: "#F5B547",
  warningSoft: "#33270F",
  overlay: "rgba(0,0,0,0.6)",
  shadow: "#000000",
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.5 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "700", letterSpacing: -0.3 },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: "600" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: "700", letterSpacing: 0.4 },
} as const satisfies Record<string, TextStyle>;

/** Taille minimale d'une zone tactile (recommandations iOS / Material). */
export const TOUCH_TARGET = 44;

const makeShadows = (colors: ThemeColors, dark: boolean) =>
  ({
    card: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: dark ? 0.4 : 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    raised: {
      shadowColor: dark ? colors.shadow : colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: dark ? 0.5 : 0.25,
      shadowRadius: 16,
      elevation: 6,
    },
  }) satisfies Record<string, ViewStyle>;

const makeTheme = (colors: ThemeColors, dark: boolean) => ({
  dark,
  colors,
  spacing,
  radius,
  typography,
  shadows: makeShadows(colors, dark),
});

export type Theme = ReturnType<typeof makeTheme>;

export const lightTheme: Theme = makeTheme(lightColors, false);
export const darkTheme: Theme = makeTheme(darkColors, true);

/**
 * Couleurs d'accent utilisées quand Trello ne fournit pas de couleur
 * (boards sans fond, workspaces, avatars). Toutes lisibles avec du texte blanc.
 */
export const ACCENT_COLORS = [
  "#5B3DF5",
  "#0C66E4",
  "#1F7A4D",
  "#A54800",
  "#C9372C",
  "#A13D7E",
  "#5E4DB2",
  "#1D6B85",
] as const;

/** Couleurs officielles des étiquettes Trello (variantes _light / _dark ramenées à la base). */
export const LABEL_COLORS: Record<string, string> = {
  green: "#4BCE97",
  yellow: "#F5CD47",
  orange: "#FEA362",
  red: "#F87168",
  purple: "#9F8FEF",
  blue: "#579DFF",
  sky: "#6CC3E0",
  lime: "#94C748",
  pink: "#E774BB",
  black: "#9AA3B3",
};

/** Texte posé sur une étiquette Trello : toujours sombre, comme dans Trello. */
export const LABEL_TEXT = "#172B4D";
