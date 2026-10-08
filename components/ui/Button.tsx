import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme, TOUCH_TARGET } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";
import { IconName } from "./IconButton";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  size?: "lg" | "md";
  style?: ViewStyle;
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  loading,
  disabled,
  size = "md",
  style,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const foreground = {
    primary: colors.onPrimary,
    secondary: colors.primary,
    danger: colors.danger,
    ghost: colors.textMuted,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        size === "lg" && styles.large,
        styles[variant],
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={foreground} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={18} color={foreground} /> : null}
          <AppText variant="bodyStrong" style={{ color: foreground }}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    base: {
      minHeight: TOUCH_TARGET + 4,
      paddingHorizontal: spacing.lg,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    large: { minHeight: 56, borderRadius: radius.lg },
    content: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.primarySoft },
    danger: { backgroundColor: colors.dangerSoft },
    ghost: { backgroundColor: colors.surfaceMuted },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    disabled: { opacity: 0.5 },
  });
