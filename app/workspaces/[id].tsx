import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Board } from "@/types";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { useBoards } from "@/hooks/useBoards";
import { confirm } from "@/utils/confirm";
import Screen from "@/components/ui/Screen";
import Header from "@/components/ui/Header";
import Fab from "@/components/ui/Fab";
import Sheet from "@/components/ui/Sheet";
import ActionSheet from "@/components/ui/ActionSheet";
import EntityForm from "@/components/ui/EntityForm";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import BoardTile from "@/components/board/BoardTile";

const GUTTER = 20;
const GAP = 14;

export default function WorkspaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { width } = useWindowDimensions();
  const { workspace, boards, status, error, refreshing, refresh, retry, addBoard, editBoard, removeBoard } =
    useBoards(id);

  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Board | null>(null);
  const [editing, setEditing] = useState<Board | null>(null);

  // Grille adaptative : 2 colonnes sur téléphone, plus sur tablette.
  const columns = Math.max(2, Math.floor((width - GUTTER * 2 + GAP) / 200));
  const tileWidth = (width - GUTTER * 2 - GAP * (columns - 1)) / columns;

  const askDelete = async (board: Board) => {
    const ok = await confirm({
      title: "Supprimer le board ?",
      message: `« ${board.name} », ses listes et ses cartes seront supprimés définitivement. Cette action est irréversible.`,
      confirmLabel: "Supprimer",
    });
    if (ok) await removeBoard(board.id);
  };

  const subtitle =
    status === "ready" ? `${boards.length} board${boards.length > 1 ? "s" : ""}` : undefined;

  return (
    <Screen>
      <Header title={workspace?.displayName ?? "Espace de travail"} subtitle={subtitle} />

      {status === "error" && error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : status === "loading" ? (
        <View style={[styles.grid, styles.skeletons]}>
          {Array.from({ length: columns * 2 }, (_, i) => (
            <Skeleton key={i} width={tileWidth} height={160} radius={18} />
          ))}
        </View>
      ) : (
        <FlatList
          key={columns}
          data={boards}
          numColumns={columns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={columns > 1 ? { gap: GAP } : undefined}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="grid-outline"
              title="Aucun board"
              message="Un board regroupe les listes et les cartes d'un projet."
              actionLabel="Créer un board"
              onAction={() => setCreating(true)}
            />
          }
          renderItem={({ item, index }) => (
            <BoardTile
              board={item}
              index={index}
              width={tileWidth}
              onPress={() => router.push(`/boards/${item.id}`)}
              onMore={() => setSelected(item)}
            />
          )}
        />
      )}

      {status === "ready" && boards.length > 0 ? <Fab label="Nouveau board" onPress={() => setCreating(true)} /> : null}

      <Sheet visible={creating} onClose={() => setCreating(false)} title="Nouveau board">
        <EntityForm
          nameLabel="Nom du board"
          namePlaceholder="Ex. Lancement v2"
          withDescription
          submitLabel="Créer"
          onCancel={() => setCreating(false)}
          onSubmit={async ({ name, desc }) => {
            const ok = await addBoard(name, desc);
            if (ok) setCreating(false);
            return ok;
          }}
        />
      </Sheet>

      <Sheet visible={!!editing} onClose={() => setEditing(null)} title="Modifier le board">
        {editing ? (
          <EntityForm
            nameLabel="Nom du board"
            namePlaceholder="Nom du board"
            withDescription
            initialValues={{ name: editing.name, desc: editing.desc }}
            submitLabel="Enregistrer"
            onCancel={() => setEditing(null)}
            onSubmit={async ({ name, desc }) => {
              const ok = await editBoard(editing.id, { name, desc });
              if (ok) setEditing(null);
              return ok;
            }}
          />
        ) : null}
      </Sheet>

      <ActionSheet
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        actions={
          selected
            ? [
                { label: "Modifier", icon: "create-outline", onPress: () => setEditing(selected) },
                { label: "Supprimer", icon: "trash-outline", destructive: true, onPress: () => askDelete(selected) },
              ]
            : []
        }
      />
    </Screen>
  );
}

const makeStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    grid: { paddingHorizontal: GUTTER, paddingTop: spacing.sm, paddingBottom: 120, gap: GAP, flexGrow: 1 },
    skeletons: { flexDirection: "row", flexWrap: "wrap" },
  });
