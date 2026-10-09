import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "@/components/ui/AppText";
import { IconName } from "@/components/ui/IconButton";

type Props = {
  icon: IconName;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
  children: ReactNode;
};

/** Bloc titré de l'écran carte (description, membres, checklists…). */
export default function Section({ icon, title, subtitle, action, children }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <AppText variant="bodyStrong" style={styles.title} accessibilityRole="header">
          {title}
        </AppText>
        {action ? (
          <Pressable onPress={action.onPress} accessibilityRole="button" hitSlop={12}>
            <AppText variant="caption" color="primary">
              {action.label}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {subtitle ? (
        <AppText variant="caption" color="textSubtle">
          {subtitle}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    section: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg + 4,
      padding: spacing.lg,
      gap: spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    title: { flex: 1 },
  });
