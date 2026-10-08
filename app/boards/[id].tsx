import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ListWithCards } from "@/types";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { useBoard } from "@/hooks/useBoard";
import { confirm } from "@/utils/confirm";
import Screen from "@/components/ui/Screen";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import AppText from "@/components/ui/AppText";
import Sheet from "@/components/ui/Sheet";
import ActionSheet from "@/components/ui/ActionSheet";
import EntityForm from "@/components/ui/EntityForm";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import ListColumn from "@/components/list/ListColumn";
import { boardColor } from "@/components/board/boardColor";

const GAP = 12;
const HEADER_HEIGHT = 64;

type SheetState =
  | { kind: "createList" }
  | { kind: "renameList"; list: ListWithCards }
  | { kind: "createCard"; list: ListWithCards }
  | null;

export default function BoardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const {
    board,
    lists,
    members,
    status,
    error,
    refreshing,
    refresh,
    retry,
    addList,
    renameList,
    removeList,
    addCard,
    toggleStar,
  } = useBoard(id);

  const [sheet, setSheet] = useState<SheetState>(null);
  const [menuList, setMenuList] = useState<ListWithCards | null>(null);

  // Les colonnes laissent dépasser la suivante pour indiquer qu'on peut faire défiler.
  const columnWidth = Math.min(width * 0.82, 320);
  const columnMaxHeight = height - insets.top - insets.bottom - HEADER_HEIGHT - 40;
  const tint = board ? boardColor(board) : colors.primary;
  const cardCount = lists.reduce((total, list) => total + list.cards.length, 0);

  const askArchive = async (list: ListWithCards) => {
    const ok = await confirm({
      title: "Archiver la liste ?",
      message: `« ${list.name} » et ses ${list.cards.length} carte(s) seront archivées. Vous pourrez les restaurer depuis Trello.`,
      confirmLabel: "Archiver",
    });
    if (ok) await removeList(list.id);
  };

  const closeSheet = () => setSheet(null);

  return (
    <Screen edges={[]} lightStatusBar>
      <View style={[styles.band, { backgroundColor: tint, paddingTop: insets.top }]}>
        <Header
          onColor
          title={board?.name ?? "Board"}
          subtitle={status === "ready" ? `${lists.length} liste${lists.length > 1 ? "s" : ""} · ${cardCount} carte${cardCount > 1 ? "s" : ""}` : undefined}
          right={
            <>
            {board ? (
              <IconButton
                icon={board.starred ? "star" : "star-outline"}
                variant="onColor"
                accessibilityLabel={board.starred ? "Retirer des favoris" : "Ajouter aux favoris"}
                onPress={() => toggleStar(board.id, !!board.starred)}
              />
            ) : null}
            <IconButton
              icon="refresh"
              variant="onColor"
              accessibilityLabel="Actualiser le board"
              onPress={refresh}
              disabled={refreshing || status !== "ready"}
            />
            </>
          }
        />
      </View>

      {status === "error" && error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : status === "loading" ? (
        <View style={styles.skeletonRow}>
          {[0, 1].map((i) => (
            <View key={i} style={[styles.skeletonColumn, { width: columnWidth }]}>
              <Skeleton height={20} width="50%" />
              <Skeleton height={72} />
              <Skeleton height={56} />
              <Skeleton height={88} />
            </View>
          ))}
        </View>
      ) : lists.length === 0 ? (
        <EmptyState
          icon="list-outline"
          title="Ce board est vide"
          message="Commencez par créer une liste, par exemple « À faire », « En cours » et « Terminé »."
          actionLabel="Créer une liste"
          onAction={() => setSheet({ kind: "createList" })}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={columnWidth + GAP}
          decelerationRate="fast"
          contentContainerStyle={[styles.columns, { paddingBottom: insets.bottom + 16 }]}
        >
          {lists.map((list) => (
            <ListColumn
              key={list.id}
              list={list}
              members={members}
              width={columnWidth}
              maxHeight={columnMaxHeight}
              onCardPress={(cardId) => router.push(`/cards/${cardId}`)}
              onAddCard={() => setSheet({ kind: "createCard", list })}
              onMore={() => setMenuList(list)}
            />
          ))}

          <Pressable
            onPress={() => setSheet({ kind: "createList" })}
            accessibilityRole="button"
            accessibilityLabel="Ajouter une liste"
            style={({ pressed }) => [styles.addList, { width: columnWidth }, pressed && styles.addListPressed]}
          >
            <View style={styles.addListIcon}>
              <Ionicons name="add" size={22} color={colors.primary} />
            </View>
            <AppText variant="bodyStrong" color="primary">
              Ajouter une liste
            </AppText>
          </Pressable>
        </ScrollView>
      )}

      <Sheet visible={sheet?.kind === "createList"} onClose={closeSheet} title="Nouvelle liste">
        <EntityForm
          nameLabel="Nom de la liste"
          namePlaceholder="Ex. À faire"
          submitLabel="Créer"
          onCancel={closeSheet}
          onSubmit={async ({ name }) => {
            const ok = await addList(name);
            if (ok) closeSheet();
            return ok;
          }}
        />
      </Sheet>

      <Sheet visible={sheet?.kind === "renameList"} onClose={closeSheet} title="Renommer la liste">
        {sheet?.kind === "renameList" ? (
          <EntityForm
            nameLabel="Nom de la liste"
            namePlaceholder="Nom de la liste"
            initialValues={{ name: sheet.list.name }}
            submitLabel="Enregistrer"
            onCancel={closeSheet}
            onSubmit={async ({ name }) => {
              const ok = await renameList(sheet.list.id, name);
              if (ok) closeSheet();
              return ok;
            }}
          />
        ) : null}
      </Sheet>

      <Sheet
        visible={sheet?.kind === "createCard"}
        onClose={closeSheet}
        title={sheet?.kind === "createCard" ? `Nouvelle carte · ${sheet.list.name}` : "Nouvelle carte"}
      >
        {sheet?.kind === "createCard" ? (
          <EntityForm
            nameLabel="Titre de la carte"
            namePlaceholder="Ex. Préparer la démo"
            withDescription
            submitLabel="Ajouter"
            onCancel={closeSheet}
            onSubmit={async ({ name, desc }) => {
              const ok = await addCard(sheet.list.id, name, desc);
              if (ok) closeSheet();
              return ok;
            }}
          />
        ) : null}
      </Sheet>

      <ActionSheet
        visible={!!menuList}
        onClose={() => setMenuList(null)}
        title={menuList?.name}
        actions={
          menuList
            ? [
                { label: "Ajouter une carte", icon: "add-circle-outline", onPress: () => setSheet({ kind: "createCard", list: menuList }) },
                { label: "Renommer", icon: "create-outline", onPress: () => setSheet({ kind: "renameList", list: menuList }) },
                { label: "Archiver la liste", icon: "archive-outline", destructive: true, onPress: () => askArchive(menuList) },
              ]
            : []
        }
      />
    </Screen>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    band: { borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
    columns: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: GAP, alignItems: "flex-start" },
    skeletonRow: { flexDirection: "row", gap: GAP, padding: spacing.lg },
    skeletonColumn: {
      gap: spacing.sm,
      padding: spacing.sm,
      borderRadius: radius.lg + 4,
      backgroundColor: colors.surfaceMuted,
    },
    addList: {
      minHeight: 120,
      borderRadius: radius.lg + 4,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },
    addListPressed: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
    addListIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
  });
