import { ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  leading?: ReactNode;
  disabled?: boolean;
};

/** Pastille sélectionnable (liste de destination, membres…). */
export default function Chip({ label, selected, onPress, leading, disabled }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {leading}
      <AppText variant="caption" numberOfLines={1} style={{ color: selected ? colors.primary : colors.text }}>
        {label}
      </AppText>
      {selected ? <Ionicons name="checkmark" size={16} color={colors.primary} /> : null}
    </Pressable>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: 40,
      paddingHorizontal: spacing.md,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1.5,
      borderColor: "transparent",
      maxWidth: 240,
    },
    selected: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
    pressed: { opacity: 0.75 },
    disabled: { opacity: 0.5 },
  });
