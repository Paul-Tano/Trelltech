import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, Theme } from "@/constants/theme";

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? darkTheme : lightTheme;
}

/**
 * Crée des styles dépendants du thème.
 * `factory` doit être déclarée au niveau du module pour que la mémoïsation fonctionne.
 */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
