import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Member } from "@/types";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "@/components/ui/AppText";
import { AvatarStack } from "@/components/ui/Avatar";
import DueBadge from "./DueBadge";
import LabelPill from "./LabelPill";

type Props = {
  card: Card;
  members: Member[];
  onPress: () => void;
};

/** Aperçu d'une carte : étiquettes, titre, échéance, indicateurs et membres assignés. */
export default function CardItem({ card, members, onPress }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const assigned = members.filter((m) => card.idMembers.includes(m.id));
  const { badges } = card;
  const hasChecklist = !!badges?.checkItems;
  const checklistDone = hasChecklist && badges?.checkItems === badges?.checkItemsChecked;
  const hasFooter =
    !!card.due || !!card.desc || !!badges?.comments || !!badges?.attachments || hasChecklist || assigned.length > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Carte ${card.name}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {card.labels?.length ? (
        <View style={styles.labels}>
          {card.labels.map((label) => (
            <LabelPill key={label.id} label={label} compact />
          ))}
        </View>
      ) : null}

      <AppText variant="bodyStrong" style={styles.title}>
        {card.name}
      </AppText>

      {hasFooter ? (
        <View style={styles.footer}>
          <View style={styles.indicators}>
            {card.due ? <DueBadge due={card.due} dueComplete={card.dueComplete} /> : null}
            {card.desc ? (
              <Ionicons name="reorder-three-outline" size={16} color={colors.textSubtle} accessibilityLabel="Description" />
            ) : null}
            {badges?.comments ? (
              <View style={styles.indicator}>
                <Ionicons name="chatbubble-outline" size={13} color={colors.textSubtle} />
                <AppText variant="micro" color="textSubtle">
                  {badges.comments}
                </AppText>
              </View>
            ) : null}
            {badges?.attachments ? (
              <View style={styles.indicator}>
                <Ionicons name="attach" size={14} color={colors.textSubtle} />
                <AppText variant="micro" color="textSubtle">
                  {badges.attachments}
                </AppText>
              </View>
            ) : null}
            {hasChecklist ? (
              <View style={[styles.indicator, checklistDone && styles.checklistDone]}>
                <Ionicons
                  name="checkbox-outline"
                  size={13}
                  color={checklistDone ? colors.success : colors.textSubtle}
                />
                <AppText variant="micro" style={{ color: checklistDone ? colors.success : colors.textSubtle }}>
                  {badges?.checkItemsChecked}/{badges?.checkItems}
                </AppText>
              </View>
            ) : null}
          </View>
          {assigned.length > 0 ? <AvatarStack members={assigned} size={24} /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const makeStyles = ({ colors, radius, spacing, shadows }: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      ...shadows.card,
    },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    labels: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
    title: { fontWeight: "500" },
    footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
    indicators: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: spacing.sm, flex: 1 },
    indicator: { flexDirection: "row", alignItems: "center", gap: 3 },
    checklistDone: { backgroundColor: colors.successSoft, borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2 },
  });
