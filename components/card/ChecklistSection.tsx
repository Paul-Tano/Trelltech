import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Checklist } from "@/types";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { useChecklists } from "@/hooks/useChecklists";
import { confirm } from "@/utils/confirm";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Sheet from "@/components/ui/Sheet";
import EntityForm from "@/components/ui/EntityForm";
import { Skeleton } from "@/components/ui/States";
import Section from "./Section";

type Props = { cardId: string };

/** Checklists de la carte : progression, cases à cocher, ajout et suppression d'éléments. */
export default function ChecklistSection({ cardId }: Props) {
  const { checklists, status, addChecklist, removeChecklist, addItem, toggleItem, removeItem } =
    useChecklists(cardId);
  const [creating, setCreating] = useState(false);

  const askRemove = async (checklist: Checklist) => {
    const ok = await confirm({
      title: "Supprimer la checklist ?",
      message: `« ${checklist.name} » et ses ${checklist.checkItems.length} élément(s) seront supprimés.`,
      confirmLabel: "Supprimer",
    });
    if (ok) await removeChecklist(checklist.id);
  };

  return (
    <>
      {status === "loading" ? (
        <Skeleton height={96} radius={20} />
      ) : (
        checklists.map((checklist) => (
          <ChecklistCard
            key={checklist.id}
            checklist={checklist}
            onToggle={(item) => toggleItem(checklist.id, item)}
            onRemoveItem={(itemId) => removeItem(checklist.id, itemId)}
            onAddItem={(name) => addItem(checklist.id, name)}
            onRemove={() => askRemove(checklist)}
          />
        ))
      )}

      <Button label="Ajouter une checklist" icon="checkbox-outline" variant="ghost" onPress={() => setCreating(true)} />

      <Sheet visible={creating} onClose={() => setCreating(false)} title="Nouvelle checklist">
        <EntityForm
          nameLabel="Titre"
          namePlaceholder="Ex. Avant la mise en ligne"
          initialValues={{ name: "Checklist" }}
          submitLabel="Créer"
          onCancel={() => setCreating(false)}
          onSubmit={async ({ name }) => {
            const ok = await addChecklist(name);
            if (ok) setCreating(false);
            return ok;
          }}
        />
      </Sheet>
    </>
  );
}

type CardProps = {
  checklist: Checklist;
  onToggle: (item: Checklist["checkItems"][number]) => void;
  onRemoveItem: (itemId: string) => void;
  onAddItem: (name: string) => Promise<boolean>;
  onRemove: () => void;
};

function ChecklistCard({ checklist, onToggle, onRemoveItem, onAddItem, onRemove }: CardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  const items = [...checklist.checkItems].sort((a, b) => (a.pos ?? 0) - (b.pos ?? 0));
  const done = items.filter((i) => i.state === "complete").length;
  const progress = items.length ? done / items.length : 0;
  const complete = items.length > 0 && done === items.length;

  const submit = async () => {
    if (!draft.trim()) return;
    setAdding(true);
    const ok = await onAddItem(draft.trim());
    setAdding(false);
    if (ok) setDraft("");
  };

  return (
    <Section icon="checkbox-outline" title={checklist.name}>
      <View style={styles.progressRow}>
        <AppText variant="micro" style={{ color: complete ? colors.success : colors.textMuted }}>
          {Math.round(progress * 100)} %
        </AppText>
        <View
          style={styles.track}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: items.length, now: done }}
        >
          <View
            style={[
              styles.fill,
              { width: `${progress * 100}%`, backgroundColor: complete ? colors.success : colors.primary },
            ]}
          />
        </View>
        <IconButton
          icon="trash-outline"
          size="sm"
          variant="ghost"
          accessibilityLabel={`Supprimer la checklist ${checklist.name}`}
          onPress={onRemove}
        />
      </View>

      {items.map((item) => {
        const checked = item.state === "complete";
        return (
          <View key={item.id} style={styles.item}>
            <Pressable
              onPress={() => onToggle(item)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
              accessibilityLabel={item.name}
              style={styles.itemMain}
            >
              <View style={[styles.box, checked && styles.boxChecked]}>
                {checked ? <Ionicons name="checkmark" size={16} color={colors.onPrimary} /> : null}
              </View>
              <AppText color={checked ? "textSubtle" : "text"} style={[styles.itemText, checked && styles.itemDone]}>
                {item.name}
              </AppText>
            </Pressable>
            <IconButton
              icon="close"
              size="sm"
              variant="ghost"
              accessibilityLabel={`Supprimer l'élément ${item.name}`}
              onPress={() => onRemoveItem(item.id)}
            />
          </View>
        );
      })}

      <View style={styles.addRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Ajouter un élément…"
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.primary}
          onSubmitEditing={submit}
          returnKeyType="done"
          blurOnSubmit={false}
          accessibilityLabel={`Ajouter un élément à ${checklist.name}`}
          style={styles.input}
          maxLength={512}
        />
        <IconButton
          icon="add"
          variant="primary"
          size="sm"
          accessibilityLabel="Ajouter l'élément"
          onPress={submit}
          disabled={!draft.trim() || adding}
        />
      </View>
    </Section>
  );
}

const makeStyles = ({ colors, radius, spacing, typography }: Theme) =>
  StyleSheet.create({
    progressRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.surfaceMuted, overflow: "hidden" },
    fill: { height: 8, borderRadius: 4 },
    item: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
    itemMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 44 },
    box: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
    itemText: { flex: 1 },
    itemDone: { textDecorationLine: "line-through" },
    addRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    input: {
      ...typography.body,
      flex: 1,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      minHeight: 44,
    },
  });
