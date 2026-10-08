import { useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
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
  const { workspaces, status, error, refreshing, refresh, retry, addWorkspace, removeWorkspace } = useWorkspaces();

  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Workspace | null>(null);

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

      <ActionSheet
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.displayName}
        actions={
          selected
            ? [
                { label: "Ouvrir", icon: "open-outline", onPress: () => router.push(`/workspaces/${selected.id}`) },
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
  });
