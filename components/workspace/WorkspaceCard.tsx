import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Workspace } from "@/types";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { accentFor, initials } from "@/utils/color";
import AppText from "@/components/ui/AppText";
import IconButton from "@/components/ui/IconButton";

type Props = {
  workspace: Workspace;
  index: number;
  onPress: () => void;
  onMore: () => void;
};

export default function WorkspaceCard({ workspace, index, onPress, onMore }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const accent = accentFor(workspace.id);
  const memberCount = workspace.memberships?.filter((m) => !m.deactivated).length ?? 0;

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 50).springify().damping(18)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ouvrir l'espace ${workspace.displayName}`}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={[styles.badge, { backgroundColor: accent }]}>
          <AppText variant="headline" style={styles.badgeText}>
            {initials(workspace.displayName)}
          </AppText>
        </View>

        <View style={styles.info}>
          <AppText variant="headline" numberOfLines={1}>
            {workspace.displayName}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {workspace.desc || "Aucune description"}
          </AppText>
          {memberCount > 0 ? (
            <View style={styles.meta}>
              <Ionicons name="people-outline" size={14} color={colors.textSubtle} />
              <AppText variant="caption" color="textSubtle">
                {memberCount} membre{memberCount > 1 ? "s" : ""}
              </AppText>
            </View>
          ) : null}
        </View>

        <IconButton
          icon="ellipsis-horizontal"
          variant="ghost"
          accessibilityLabel={`Options de ${workspace.displayName}`}
          onPress={onMore}
        />
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = ({ colors, radius, spacing, shadows }: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg + 4,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      ...shadows.card,
    },
    pressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
    badge: {
      width: 52,
      height: 52,
      borderRadius: radius.md + 2,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: { color: "#FFFFFF", fontWeight: "800" },
    info: { flex: 1, gap: 2 },
    meta: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.xs },
  });
