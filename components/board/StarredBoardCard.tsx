import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Board } from "@/types";
import { Theme } from "@/constants/theme";
import { useThemedStyles } from "@/hooks/useTheme";
import AppText from "@/components/ui/AppText";
import { boardColor } from "./boardColor";

type Props = { board: Board; onPress: () => void; onToggleStar: () => void };

/** Carte compacte d'un board favori, pour le carrousel de l'accueil. */
export default function StarredBoardCard({ board, onPress, onToggleStar }: Props) {
  const styles = useThemedStyles(makeStyles);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir le board favori ${board.name}`}
      style={({ pressed }) => [styles.card, { backgroundColor: boardColor(board) }, pressed && styles.pressed]}
    >
      <View style={styles.shine} />
      <Pressable
        onPress={onToggleStar}
        accessibilityRole="button"
        accessibilityLabel={`Retirer ${board.name} des favoris`}
        hitSlop={10}
        style={styles.star}
      >
        <Ionicons name="star" size={16} color="#FFD34E" />
      </Pressable>
      <AppText variant="bodyStrong" numberOfLines={2} style={styles.name}>
        {board.name}
      </AppText>
    </Pressable>
  );
}

const makeStyles = ({ radius, spacing, shadows }: Theme) =>
  StyleSheet.create({
    card: {
      width: 150,
      height: 96,
      borderRadius: radius.lg,
      padding: spacing.md,
      justifyContent: "flex-end",
      overflow: "hidden",
      ...shadows.card,
    },
    pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
    shine: {
      position: "absolute",
      top: -40,
      right: -30,
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: "rgba(255,255,255,0.14)",
    },
    star: {
      position: "absolute",
      top: spacing.sm,
      right: spacing.sm,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.18)",
      alignItems: "center",
      justifyContent: "center",
    },
    name: { color: "#FFFFFF" },
  });
