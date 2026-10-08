import { ComponentProps } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOUCH_TARGET } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  icon: IconName;
  /** Obligatoire : c'est ce que lit le lecteur d'écran. */
  accessibilityLabel: string;
  onPress: () => void;
  variant?: "ghost" | "soft" | "primary" | "onColor";
  size?: "md" | "sm";
  disabled?: boolean;
  style?: ViewStyle;
};

export default function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = "soft",
  size = "md",
  disabled,
  style,
}: Props) {
  const { colors } = useTheme();
  const dimension = size === "md" ? 40 : 32;

  const palette = {
    ghost: { bg: "transparent", fg: colors.textMuted },
    soft: { bg: colors.surfaceMuted, fg: colors.text },
    primary: { bg: colors.primary, fg: colors.onPrimary },
    onColor: { bg: "rgba(255,255,255,0.22)", fg: "#FFFFFF" },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      // Zone tactile d'au moins 44 px même quand le bouton visible est plus petit.
      hitSlop={(TOUCH_TARGET - dimension) / 2}
      style={({ pressed }) => [
        styles.base,
        { width: dimension, height: dimension, borderRadius: dimension / 2, backgroundColor: palette.bg },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={icon} size={size === "md" ? 20 : 16} color={palette.fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  disabled: { opacity: 0.4 },
});
