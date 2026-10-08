import { Pressable, StyleSheet } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";
import { IconName } from "./IconButton";

type Props = { label: string; icon?: IconName; onPress: () => void };

/** Bouton d'action principal flottant, toujours au même endroit sur chaque écran. */
export default function Fab({ label, icon = "add", onPress }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <Animated.View entering={ZoomIn.delay(150).springify()} style={[styles.host, { bottom: insets.bottom + 20 }]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
      >
        <Ionicons name={icon} size={22} color={colors.onPrimary} />
        <AppText variant="bodyStrong" style={{ color: colors.onPrimary }}>
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = ({ colors, radius, spacing, shadows }: Theme) =>
  StyleSheet.create({
    host: { position: "absolute", right: spacing.xl },
    fab: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      paddingLeft: spacing.lg,
      paddingRight: spacing.xl,
      height: 56,
      ...shadows.raised,
    },
    pressed: { backgroundColor: colors.primaryPressed, transform: [{ scale: 0.97 }] },
  });
