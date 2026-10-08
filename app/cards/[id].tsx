import { ReactNode, useState } from "react";
import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { useCard } from "@/hooks/useCard";
import { confirm } from "@/utils/confirm";
import Screen from "@/components/ui/Screen";
import Header from "@/components/ui/Header";
import IconButton, { IconName } from "@/components/ui/IconButton";
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

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const { card, lists, members, status, error, refreshing, refresh, retry, update, moveTo, toggleMember, remove } =
    useCard(id);

  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
            <IconButton icon="ellipsis-horizontal" accessibilityLabel="Options de la carte" onPress={() => setMenuOpen(true)} />
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
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
        >
          {card.labels?.length ? (
            <View style={styles.labels}>
              {card.labels.map((label) => (
                <LabelPill key={label.id} label={label} />
              ))}
            </View>
          ) : null}

          <Pressable
            onPress={() => setEditing(true)}
            accessibilityRole="button"
            accessibilityHint="Modifier le titre et la description"
          >
            <AppText variant="title">{card.name}</AppText>
          </Pressable>

          {card.due ? (
            <View style={styles.dueRow}>
              <DueBadge due={card.due} dueComplete={card.dueComplete} large />
              <Button
                label={card.dueComplete ? "Rouvrir" : "Marquer terminée"}
                icon={card.dueComplete ? "refresh" : "checkmark"}
                variant={card.dueComplete ? "ghost" : "secondary"}
                onPress={() => update({ dueComplete: !card.dueComplete })}
              />
            </View>
          ) : null}

          <Section icon="reorder-three-outline" title="Description" action={{ label: "Modifier", onPress: () => setEditing(true) }}>
            <Pressable onPress={() => setEditing(true)} accessibilityRole="button" accessibilityLabel="Modifier la description">
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

          {card.url ? (
            <Button
              label="Ouvrir dans Trello"
              icon="open-outline"
              variant="ghost"
              onPress={() => card.url && Linking.openURL(card.url)}
            />
          ) : null}
        </ScrollView>
      )}

      <Sheet visible={editing} onClose={() => setEditing(false)} title="Modifier la carte">
        {card ? (
          <EntityForm
            nameLabel="Titre"
            namePlaceholder="Titre de la carte"
            withDescription
            initialValues={{ name: card.name, desc: card.desc }}
            submitLabel="Enregistrer"
            onCancel={() => setEditing(false)}
            onSubmit={async ({ name, desc }) => {
              const ok = await update({ name, desc });
              if (ok) setEditing(false);
              return ok;
            }}
          />
        ) : null}
      </Sheet>

      <ActionSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={card?.name}
        actions={[
          { label: "Modifier", icon: "create-outline", onPress: () => setEditing(true) },
          { label: "Supprimer la carte", icon: "trash-outline", destructive: true, onPress: askDelete },
        ]}
      />
    </Screen>
  );
}

type SectionProps = {
  icon: IconName;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
  children: ReactNode;
};

function Section({ icon, title, subtitle, action, children }: SectionProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <AppText variant="bodyStrong" style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </AppText>
        {action ? (
          <Pressable onPress={action.onPress} accessibilityRole="button" hitSlop={12}>
            <AppText variant="caption" color="primary">
              {action.label}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {subtitle ? (
        <AppText variant="caption" color="textSubtle">
          {subtitle}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    content: { paddingHorizontal: spacing.lg + 4, paddingTop: spacing.sm, gap: spacing.lg },
    labels: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs + 2 },
    dueRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, flexWrap: "wrap" },
    section: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg + 4,
      padding: spacing.lg,
      gap: spacing.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    sectionTitle: { flex: 1 },
    chips: { gap: spacing.sm },
    wrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  });
