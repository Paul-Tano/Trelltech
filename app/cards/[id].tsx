import { useState } from "react";
import { KeyboardAvoidingView, Linking, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { useCard } from "@/hooks/useCard";
import { confirm } from "@/utils/confirm";
import Screen from "@/components/ui/Screen";
import Header from "@/components/ui/Header";
import IconButton from "@/components/ui/IconButton";
import AppText from "@/components/ui/AppText";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import Sheet from "@/components/ui/Sheet";
import ActionSheet from "@/components/ui/ActionSheet";
import EntityForm from "@/components/ui/EntityForm";
import { ErrorState, Skeleton } from "@/components/ui/States";
import DueBadge from "@/components/card/DueBadge";
import LabelPill from "@/components/card/LabelPill";
import Section from "@/components/card/Section";
import DueDateSheet from "@/components/card/DueDateSheet";
import LabelSheet from "@/components/card/LabelSheet";
import ChecklistSection from "@/components/card/ChecklistSection";
import CommentSection from "@/components/card/CommentSection";

type OpenSheet = "edit" | "due" | "labels" | "menu" | null;

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const {
    card,
    lists,
    members,
    boardLabels,
    status,
    error,
    refreshing,
    refresh,
    retry,
    update,
    moveTo,
    toggleMember,
    setDue,
    toggleLabel,
    createAndApplyLabel,
    remove,
  } = useCard(id);

  const [sheet, setSheet] = useState<OpenSheet>(null);
  const close = () => setSheet(null);
  const currentList = lists.find((l) => l.id === card?.idList);

  const askDelete = async () => {
    if (!card) return;
    const ok = await confirm({
      title: "Supprimer la carte ?",
      message: `« ${card.name} » sera supprimée définitivement.`,
      confirmLabel: "Supprimer",
    });
    if (ok && (await remove())) router.back();
  };

  return (
    <Screen>
      <Header
        title={currentList ? currentList.name : "Carte"}
        subtitle={currentList ? "Liste" : undefined}
        right={
          card ? (
            <IconButton icon="ellipsis-horizontal" accessibilityLabel="Options de la carte" onPress={() => setSheet("menu")} />
          ) : null
        }
      />

      {status === "error" && error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : status === "loading" || !card ? (
        <View style={styles.content}>
          <Skeleton height={14} width="30%" />
          <Skeleton height={32} width="80%" />
          <Skeleton height={120} radius={20} />
          <Skeleton height={120} radius={20} />
        </View>
      ) : (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
            }
          >
            <View style={styles.labels}>
              {card.labels?.map((label) => (
                <LabelPill key={label.id} label={label} />
              ))}
              <Pressable
                onPress={() => setSheet("labels")}
                accessibilityRole="button"
                accessibilityLabel="Gérer les étiquettes"
                hitSlop={8}
                style={styles.addLabel}
              >
                <Ionicons name={card.labels?.length ? "pricetags-outline" : "add"} size={14} color={colors.textMuted} />
                {card.labels?.length ? null : (
                  <AppText variant="micro" color="textMuted">
                    Étiquette
                  </AppText>
                )}
              </Pressable>
            </View>

            <Pressable
              onPress={() => setSheet("edit")}
              accessibilityRole="button"
              accessibilityHint="Modifier le titre et la description"
            >
              <AppText variant="title">{card.name}</AppText>
            </Pressable>

            {card.due ? (
              <View style={styles.dueRow}>
                <Pressable onPress={() => setSheet("due")} accessibilityRole="button" accessibilityHint="Modifier l'échéance">
                  <DueBadge due={card.due} dueComplete={card.dueComplete} large />
                </Pressable>
                <Button
                  label={card.dueComplete ? "Rouvrir" : "Marquer terminée"}
                  icon={card.dueComplete ? "refresh" : "checkmark"}
                  variant={card.dueComplete ? "ghost" : "secondary"}
                  onPress={() => update({ dueComplete: !card.dueComplete })}
                />
              </View>
            ) : (
              <Button
                label="Ajouter une échéance"
                icon="calendar-outline"
                variant="ghost"
                onPress={() => setSheet("due")}
                style={styles.alignStart}
              />
            )}

            <Section icon="reorder-three-outline" title="Description" action={{ label: "Modifier", onPress: () => setSheet("edit") }}>
              <Pressable onPress={() => setSheet("edit")} accessibilityRole="button" accessibilityLabel="Modifier la description">
                <AppText color={card.desc ? "text" : "textSubtle"}>
                  {card.desc || "Ajoutez une description pour donner du contexte à votre équipe…"}
                </AppText>
              </Pressable>
            </Section>

            <Section icon="swap-horizontal-outline" title="Déplacer vers">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                {lists.map((list) => (
                  <Chip
                    key={list.id}
                    label={list.name}
                    selected={list.id === card.idList}
                    onPress={() => list.id !== card.idList && moveTo(list.id)}
                  />
                ))}
              </ScrollView>
            </Section>

            <Section icon="people-outline" title="Membres" subtitle="Touchez un membre du board pour l'assigner ou le retirer.">
              {members.length === 0 ? (
                <AppText color="textSubtle">Aucun membre sur ce board.</AppText>
              ) : (
                <View style={styles.wrap}>
                  {members.map((member) => (
                    <Chip
                      key={member.id}
                      label={member.fullName || member.username}
                      selected={card.idMembers.includes(member.id)}
                      onPress={() => toggleMember(member)}
                      leading={<Avatar member={member} size={24} />}
                    />
                  ))}
                </View>
              )}
            </Section>

            <ChecklistSection cardId={card.id} />

            <CommentSection cardId={card.id} />

            {card.url ? (
              <Button
                label="Ouvrir dans Trello"
                icon="open-outline"
                variant="ghost"
                onPress={() => card.url && Linking.openURL(card.url)}
              />
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      <Sheet visible={sheet === "edit"} onClose={close} title="Modifier la carte">
        {card ? (
          <EntityForm
            nameLabel="Titre"
            namePlaceholder="Titre de la carte"
            withDescription
            initialValues={{ name: card.name, desc: card.desc }}
            submitLabel="Enregistrer"
            onCancel={close}
            onSubmit={async ({ name, desc }) => {
              const ok = await update({ name, desc });
              if (ok) close();
              return ok;
            }}
          />
        ) : null}
      </Sheet>

      <DueDateSheet visible={sheet === "due"} due={card?.due} onClose={close} onSave={setDue} />

      <LabelSheet
        visible={sheet === "labels"}
        onClose={close}
        boardLabels={boardLabels}
        selectedIds={card?.labels?.map((l) => l.id) ?? []}
        onToggle={toggleLabel}
        onCreate={createAndApplyLabel}
      />

      <ActionSheet
        visible={sheet === "menu"}
        onClose={close}
        title={card?.name}
        actions={[
          { label: "Modifier", icon: "create-outline", onPress: () => setSheet("edit") },
          { label: card?.due ? "Modifier l'échéance" : "Ajouter une échéance", icon: "calendar-outline", onPress: () => setSheet("due") },
          { label: "Étiquettes", icon: "pricetags-outline", onPress: () => setSheet("labels") },
          { label: "Supprimer la carte", icon: "trash-outline", destructive: true, onPress: askDelete },
        ]}
      />
    </Screen>
  );
}

const makeStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    flex: { flex: 1 },
    content: { paddingHorizontal: spacing.lg + 4, paddingTop: spacing.sm, gap: spacing.lg },
    labels: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing.xs + 2 },
    addLabel: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      height: 24,
      paddingHorizontal: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.border,
      backgroundColor: colors.surfaceMuted,
    },
    dueRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap" },
    alignStart: { alignSelf: "flex-start" },
    chips: { gap: spacing.sm },
    wrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  });
