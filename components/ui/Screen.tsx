import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  children: ReactNode;
  /** Bords protégés par la safe area (encoche, barre de navigation…). */
  edges?: Edge[];
  /** Barre d'état claire, pour les en-têtes posés sur une couleur. */
  lightStatusBar?: boolean;
  style?: ViewStyle;
};

/** Conteneur racine de chaque écran : fond du thème + safe area + barre d'état. */
export default function Screen({ children, edges = ["top"], lightStatusBar, style }: Props) {
  const { colors, dark } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: colors.background }, style]}>
      <StatusBar style={lightStatusBar || dark ? "light" : "dark"} />
      <View style={styles.root}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
