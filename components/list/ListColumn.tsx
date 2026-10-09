import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListWithCards, Member } from "@/types";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "@/components/ui/AppText";
import IconButton from "@/components/ui/IconButton";
import CardItem from "@/components/card/CardItem";

type Props = {
  list: ListWithCards;
  members: Member[];
  width: number;
  maxHeight: number;
  onCardPress: (cardId: string) => void;
  onAddCard: () => void;
  onMore: () => void;
};

/** Colonne d'un board : en-tête, cartes défilables et ajout rapide. */
export default function ListColumn({ list, members, width, maxHeight, onCardPress, onAddCard, onMore }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.column, { width, maxHeight }]}>
      <View style={styles.header}>
        <AppText variant="bodyStrong" numberOfLines={1} style={styles.title} accessibilityRole="header">
          {list.name}
        </AppText>
        <View style={styles.count}>
          <AppText variant="micro" color="textMuted">
            {list.cards.length}
          </AppText>
        </View>
        <IconButton
          icon="ellipsis-horizontal"
          size="sm"
          variant="ghost"
          accessibilityLabel={`Options de la liste ${list.name}`}
          onPress={onMore}
        />
      </View>

      <ScrollView
        style={styles.cards}
        contentContainerStyle={styles.cardsContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {list.cards.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="layers-outline" size={22} color={colors.textSubtle} />
            <AppText variant="caption" color="textSubtle">
              Aucune carte pour l’instant
            </AppText>
          </View>
        ) : (
          list.cards.map((card) => (
            <CardItem key={card.id} card={card} members={members} onPress={() => onCardPress(card.id)} />
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={onAddCard}
        accessibilityRole="button"
        accessibilityLabel={`Ajouter une carte dans ${list.name}`}
        style={({ pressed }) => [styles.addCard, pressed && styles.addCardPressed]}
      >
        <Ionicons name="add" size={18} color={colors.primary} />
        <AppText variant="bodyStrong" color="primary">
          Ajouter une carte
        </AppText>
      </Pressable>
    </View>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    column: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg + 4,
      padding: spacing.sm,
      alignSelf: "flex-start",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingLeft: spacing.sm,
      paddingBottom: spacing.sm,
    },
    title: { flexShrink: 1 },
    count: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: 6,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      marginRight: "auto",
    },
    cards: { flexGrow: 0, flexShrink: 1 },
    cardsContent: { gap: spacing.sm, paddingBottom: spacing.xs },
    empty: {
      alignItems: "center",
      gap: spacing.xs,
      paddingVertical: spacing.xl,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.border,
    },
    addCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      minHeight: 44,
      marginTop: spacing.sm,
      borderRadius: radius.md,
    },
    addCardPressed: { backgroundColor: colors.primarySoft },
  });
