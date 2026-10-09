import { RefreshControl, SectionList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Theme, ThemeColors } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { MyCardGroupKey, useMyCards } from "@/hooks/useMyCards";
import Screen from "@/components/ui/Screen";
import Header from "@/components/ui/Header";
import AppText from "@/components/ui/AppText";
import { IconName } from "@/components/ui/IconButton";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import CardItem from "@/components/card/CardItem";
import { boardColor } from "@/components/board/boardColor";

const GROUP_STYLE: Record<MyCardGroupKey, { icon: IconName; color: keyof ThemeColors }> = {
  overdue: { icon: "alert-circle", color: "danger" },
  today: { icon: "today-outline", color: "warning" },
  week: { icon: "calendar-outline", color: "primary" },
  later: { icon: "calendar-clear-outline", color: "textMuted" },
  none: { icon: "remove-circle-outline", color: "textMuted" },
  done: { icon: "checkmark-circle", color: "success" },
};

export default function MyCardsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { groups, boardsById, counts, status, error, refreshing, refresh, retry } = useMyCards();

  const stats = [
    { label: "En retard", value: counts.overdue, fg: colors.danger, bg: colors.dangerSoft },
    { label: "Aujourd'hui", value: counts.today, fg: colors.warning, bg: colors.warningSoft },
    { label: "7 jours", value: counts.week, fg: colors.primary, bg: colors.primarySoft },
  ];

  return (
    <Screen>
      <Header
        title="Mes cartes"
        subtitle={status === "ready" ? `${counts.total} carte${counts.total > 1 ? "s" : ""} assignée${counts.total > 1 ? "s" : ""}` : undefined}
      />

      {status === "error" && error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : status === "loading" ? (
        <View style={styles.list}>
          <View style={styles.stats}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} height={76} radius={16} style={styles.stat} />
            ))}
          </View>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={84} radius={12} style={styles.skeletonCard} />
          ))}
        </View>
      ) : (
        <SectionList
          sections={groups}
          keyExtractor={(card) => card.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          ListHeaderComponent={
            counts.total > 0 ? (
              <View style={styles.stats}>
                {stats.map((stat) => (
                  <View
                    key={stat.label}
                    style={[styles.stat, { backgroundColor: stat.bg }]}
                    accessibilityLabel={`${stat.label} : ${stat.value}`}
                  >
                    <AppText variant="title" style={{ color: stat.fg }}>
                      {stat.value}
                    </AppText>
                    <AppText variant="caption" style={{ color: stat.fg }}>
                      {stat.label}
                    </AppText>
                  </View>
                ))}
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="checkmark-done-outline"
              title="Rien ne vous est assigné"
              message="Les cartes sur lesquelles vous êtes membre apparaîtront ici, triées par échéance."
            />
          }
          renderSectionHeader={({ section }) => {
            const style = GROUP_STYLE[section.key];
            return (
              <View style={styles.sectionHeader}>
                <Ionicons name={style.icon} size={18} color={colors[style.color]} />
                <AppText variant="headline" accessibilityRole="header">
                  {section.title}
                </AppText>
                <View style={styles.count}>
                  <AppText variant="micro" color="textMuted">
                    {section.data.length}
                  </AppText>
                </View>
              </View>
            );
          }}
          renderItem={({ item }) => {
            const board = boardsById.get(item.idBoard);
            return (
              <View style={styles.item}>
                {board ? (
                  <View style={styles.board}>
                    <View style={[styles.boardDot, { backgroundColor: boardColor(board) }]} />
                    <AppText variant="caption" color="textMuted" numberOfLines={1}>
                      {board.name}
                    </AppText>
                  </View>
                ) : null}
                <CardItem card={item} members={[]} onPress={() => router.push(`/cards/${item.id}`)} />
              </View>
            );
          }}
        />
      )}
    </Screen>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    list: { paddingHorizontal: spacing.lg + 4, paddingBottom: spacing.xxxl, flexGrow: 1 },
    stats: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.sm },
    stat: { flex: 1, borderRadius: radius.lg, padding: spacing.md, gap: 2 },
    skeletonCard: { marginTop: spacing.md },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.xl,
      marginBottom: spacing.sm,
    },
    count: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: 6,
      borderRadius: 11,
      backgroundColor: colors.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    item: { gap: spacing.xs, marginBottom: spacing.md },
    board: { flexDirection: "row", alignItems: "center", gap: spacing.xs + 2, paddingLeft: 2 },
    boardDot: { width: 10, height: 10, borderRadius: 3 },
  });
