import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeColors } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { dueStatus, formatDue } from "@/utils/date";
import AppText from "@/components/ui/AppText";

type Props = { due: string; dueComplete?: boolean; large?: boolean };

const STATUS: Record<
  ReturnType<typeof dueStatus>,
  { fg: keyof ThemeColors; bg: keyof ThemeColors; icon: "checkmark-circle" | "alert-circle" | "time-outline"; label: string }
> = {
  done: { fg: "success", bg: "successSoft", icon: "checkmark-circle", label: "Terminée" },
  overdue: { fg: "danger", bg: "dangerSoft", icon: "alert-circle", label: "En retard" },
  soon: { fg: "warning", bg: "warningSoft", icon: "time-outline", label: "Bientôt" },
  later: { fg: "textMuted", bg: "surfaceMuted", icon: "time-outline", label: "Échéance" },
};

/** Badge d'échéance coloré selon l'urgence (terminée, en retard, < 24 h, plus tard). */
export default function DueBadge({ due, dueComplete, large }: Props) {
  const { colors } = useTheme();
  const status = STATUS[dueStatus(due, dueComplete)];
  const fg = colors[status.fg];

  return (
    <View
      style={[styles.badge, large && styles.large, { backgroundColor: colors[status.bg] }]}
      accessibilityLabel={`${status.label} : ${formatDue(due)}`}
    >
      <Ionicons name={status.icon} size={large ? 16 : 12} color={fg} />
      <AppText variant={large ? "caption" : "micro"} style={{ color: fg }}>
        {formatDue(due)}
        {large ? ` · ${status.label}` : ""}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  large: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 6 },
});
