import { useState } from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Workspace } from "@/types";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useMe } from "@/hooks/useMe";
import { confirm } from "@/utils/confirm";
import Screen from "@/components/ui/Screen";
import AppText from "@/components/ui/AppText";
import Avatar from "@/components/ui/Avatar";
import Fab from "@/components/ui/Fab";
import Sheet from "@/components/ui/Sheet";
import ActionSheet from "@/components/ui/ActionSheet";
import EntityForm from "@/components/ui/EntityForm";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/States";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import StarredBoardCard from "@/components/board/StarredBoardCard";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5 || hour >= 18) return "Bonsoir";
  return "Bonjour";
}

export default function WorkspacesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { me } = useMe();
  const {
    workspaces,
    starred,
    status,
    error,
    refreshing,
    refresh,
    retry,
    addWorkspace,
    editWorkspace,
    removeWorkspace,
    toggleStar,
  } = useWorkspaces();

  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Workspace | null>(null);
  const [editing, setEditing] = useState<Workspace | null>(null);

  const firstName = me?.fullName?.split(" ")[0];

  const askDelete = async (workspace: Workspace) => {
    const ok = await confirm({
      title: "Supprimer l'espace de travail ?",
      message: `« ${workspace.displayName} » sera supprimé définitivement de Trello. Ses boards ne seront plus rattachés à un espace.`,
      confirmLabel: "Supprimer",
    });
    if (ok) await removeWorkspace(workspace.id);
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.greeting}>
          <AppText variant="caption" color="textMuted">
            {greeting()}
            {firstName ? "," : ""}
          </AppText>
          <AppText variant="display" numberOfLines={1}>
            {firstName ?? "TrellTech"}
          </AppText>
        </View>
        <Pressable
          onPress={() => router.push("/profile")}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir mon profil"
          style={({ pressed }) => [styles.avatarButton, pressed && { opacity: 0.8 }]}
        >
          <Avatar member={me} size={48} />
        </Pressable>
      </View>

      <Pressable
        onPress={() => router.push("/my-cards")}
        accessibilityRole="button"
        accessibilityLabel="Mes cartes : toutes les cartes qui me sont assignées"
        style={({ pressed }) => [styles.shortcut, pressed && styles.shortcutPressed]}
      >
        <View style={styles.shortcutIcon}>
          <Ionicons name="checkmark-done-outline" size={22} color={colors.onPrimary} />
        </View>
        <View style={styles.shortcutText}>
          <AppText variant="headline">Mes cartes</AppText>
          <AppText variant="caption" color="textMuted">
            Tout ce qui vous est assigné, trié par échéance
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textSubtle} />
      </Pressable>

      {starred.length > 0 ? (
        <>
          <View style={styles.sectionRow}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <AppText variant="headline" accessibilityRole="header">
              Favoris
            </AppText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.starred}
            style={styles.starredScroll}
          >
            {starred.map((board) => (
              <StarredBoardCard
                key={board.id}
                board={board}
                onPress={() => router.push(`/boards/${board.id}`)}
                onToggleStar={() => toggleStar(board.id, true)}
              />
            ))}
          </ScrollView>
        </>
      ) : null}

      <View style={styles.sectionRow}>
        <AppText variant="headline" accessibilityRole="header">
          Espaces de travail
        </AppText>
        {status === "ready" ? (
          <View style={styles.counter}>
            <AppText variant="micro" color="primary">
              {workspaces.length}
            </AppText>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <Screen>
      {status === "error" && error ? (
        <View style={styles.errorWrap}>
          {header}
          <ErrorState message={error} onRetry={retry} />
        </View>
      ) : (
        <FlatList
          data={status === "loading" ? [] : workspaces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={header}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          ListEmptyComponent={
            status === "loading" ? (
              <View style={styles.skeletons}>
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} height={88} radius={20} />
                ))}
              </View>
            ) : (
              <EmptyState
                icon="albums-outline"
                title="Aucun espace de travail"
                message="Créez votre premier espace pour y regrouper vos boards."
                actionLabel="Créer un espace"
                onAction={() => setCreating(true)}
              />
            )
          }
          renderItem={({ item, index }) => (
            <WorkspaceCard
              workspace={item}
              index={index}
              onPress={() => router.push(`/workspaces/${item.id}`)}
              onMore={() => setSelected(item)}
            />
          )}
        />
      )}

      {status === "ready" && workspaces.length > 0 ? (
        <Fab label="Nouvel espace" onPress={() => setCreating(true)} />
      ) : null}

      <Sheet visible={creating} onClose={() => setCreating(false)} title="Nouvel espace de travail">
        <EntityForm
          nameLabel="Nom"
          namePlaceholder="Ex. Équipe produit"
          withDescription
          submitLabel="Créer"
          onCancel={() => setCreating(false)}
          onSubmit={async ({ name, desc }) => {
            const ok = await addWorkspace({ displayName: name, desc });
            if (ok) setCreating(false);
            return ok;
          }}
        />
      </Sheet>

      <Sheet visible={!!editing} onClose={() => setEditing(null)} title="Modifier l'espace de travail">
        {editing ? (
          <EntityForm
            nameLabel="Nom"
            namePlaceholder="Nom de l'espace"
            withDescription
            initialValues={{ name: editing.displayName, desc: editing.desc }}
            submitLabel="Enregistrer"
            onCancel={() => setEditing(null)}
            onSubmit={async ({ name, desc }) => {
              const ok = await editWorkspace(editing.id, { displayName: name, desc });
              if (ok) setEditing(null);
              return ok;
            }}
          />
        ) : null}
      </Sheet>

      <ActionSheet
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.displayName}
        actions={
          selected
            ? [
                { label: "Ouvrir", icon: "open-outline", onPress: () => router.push(`/workspaces/${selected.id}`) },
                { label: "Modifier", icon: "create-outline", onPress: () => setEditing(selected) },
                { label: "Supprimer", icon: "trash-outline", destructive: true, onPress: () => askDelete(selected) },
              ]
            : []
        }
      />
    </Screen>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    errorWrap: { paddingHorizontal: spacing.lg + 4 },
    list: { paddingHorizontal: spacing.lg + 4, paddingBottom: 120, flexGrow: 1 },
    header: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
    topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.lg },
    greeting: { flex: 1 },
    avatarButton: { borderRadius: radius.pill, borderWidth: 2, borderColor: colors.primarySoft, padding: 2 },
    sectionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.xxl,
      marginBottom: spacing.md,
    },
    counter: {
      minWidth: 24,
      height: 24,
      paddingHorizontal: 8,
      borderRadius: 12,
      backgroundColor: colors.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    skeletons: { gap: spacing.md },
    shortcut: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginTop: spacing.xl,
      padding: spacing.lg,
      borderRadius: radius.lg + 4,
      backgroundColor: colors.primarySoft,
    },
    shortcutPressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
    shortcutIcon: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    shortcutText: { flex: 1, gap: 2 },
    starredScroll: { marginHorizontal: -(spacing.lg + 4) },
    starred: { gap: spacing.md, paddingHorizontal: spacing.lg + 4, paddingBottom: spacing.sm },
  });
