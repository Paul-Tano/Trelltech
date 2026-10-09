import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Board } from "@/types";
import { Theme } from "@/constants/theme";
import { useThemedStyles } from "@/hooks/useTheme";
import AppText from "@/components/ui/AppText";
import IconButton from "@/components/ui/IconButton";
import { boardColor } from "./boardColor";

type Props = {
  board: Board;
  index: number;
  width: number;
  onPress: () => void;
  onMore: () => void;
};

/** Tuile de board : la couverture reprend la couleur de fond définie dans Trello. */
export default function BoardTile({ board, index, width, onPress, onMore }: Props) {
  const styles = useThemedStyles(makeStyles);
  const color = boardColor(board);

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 40).springify().damping(18)} style={{ width }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ouvrir le board ${board.name}`}
        style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      >
        <View style={[styles.cover, { backgroundColor: color }]}>
          <View style={styles.coverShine} />
          {board.starred ? (
            <View style={styles.star} accessibilityLabel="Favori">
              <Ionicons name="star" size={12} color="#FFD34E" />
            </View>
          ) : null}
          <AppText style={styles.letter}>{board.name.charAt(0).toUpperCase()}</AppText>
          <IconButton
            icon="ellipsis-horizontal"
            size="sm"
            variant="onColor"
            accessibilityLabel={`Options du board ${board.name}`}
            onPress={onMore}
            style={styles.more}
          />
        </View>
        <View style={styles.body}>
          <AppText variant="bodyStrong" numberOfLines={2}>
            {board.name}
          </AppText>
          {board.desc ? (
            <AppText variant="caption" color="textMuted" numberOfLines={1}>
              {board.desc}
            </AppText>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = ({ colors, radius, spacing, shadows }: Theme) =>
  StyleSheet.create({
    tile: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg + 2,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      ...shadows.card,
    },
    pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
    cover: { height: 92, justifyContent: "flex-end", padding: spacing.md },
    coverShine: {
      position: "absolute",
      top: -40,
      right: -30,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.14)",
    },
    letter: { color: "#FFFFFF", fontSize: 32, lineHeight: 36, fontWeight: "800" },
    more: { position: "absolute", top: spacing.sm, right: spacing.sm },
    star: {
      position: "absolute",
      top: spacing.sm + 6,
      left: spacing.sm + 2,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: "rgba(0,0,0,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    body: { padding: spacing.md, gap: 2, minHeight: 64 },
  });
