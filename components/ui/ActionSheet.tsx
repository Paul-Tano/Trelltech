import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme, TOUCH_TARGET } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";
import { IconName } from "./IconButton";
import Sheet from "./Sheet";

export type Action = {
  label: string;
  icon: IconName;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: Action[];
};

/** Menu d'actions contextuel (modifier, archiver, supprimer…). */
export default function ActionSheet({ visible, onClose, title, actions }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <Sheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.list}>
        {actions.map((action) => {
          const color = action.destructive ? colors.danger : colors.text;
          return (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={() => {
                onClose();
                // iOS refuse d'ouvrir une modale / alerte pendant la fermeture d'une autre.
                setTimeout(action.onPress, Platform.OS === "ios" ? 350 : 0);
              }}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <View style={[styles.icon, action.destructive && styles.iconDanger]}>
                <Ionicons name={action.icon} size={18} color={color} />
              </View>
              <AppText variant="bodyStrong" style={{ color }}>
                {action.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    list: { gap: spacing.xs },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      minHeight: TOUCH_TARGET + 8,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
    },
    pressed: { backgroundColor: colors.surfaceMuted },
    icon: {
      width: 36,
      height: 36,
      borderRadius: radius.sm + 2,
      backgroundColor: colors.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    iconDanger: { backgroundColor: colors.dangerSoft },
  });
