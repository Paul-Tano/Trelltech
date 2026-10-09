import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Board, BoardBackground } from "@/types";
import { Theme } from "@/constants/theme";
import { BOARD_BACKGROUNDS, BOARD_TEMPLATES } from "@/constants/boardTemplates";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { readableWithWhite } from "@/utils/color";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export type CreateBoardValues = {
  name: string;
  desc: string;
  background: BoardBackground;
  /** Listes à créer (modèle) — ignoré si `idBoardSource` est défini. */
  lists: string[];
  idBoardSource?: string;
};

type Props = {
  /** Boards du workspace, proposés comme source à copier. */
  existingBoards: Board[];
  onSubmit: (values: CreateBoardValues) => Promise<boolean>;
  onCancel: () => void;
};

const COPY = "copy";

/** Création d'un board : nom, couleur, puis modèle de listes ou copie d'un board existant. */
export default function CreateBoardForm({ existingBoards, onSubmit, onCancel }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [background, setBackground] = useState<BoardBackground>("blue");
  const [templateId, setTemplateId] = useState("kanban");
  const [sourceId, setSourceId] = useState<string | null>(existingBoards[0]?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const preview = readableWithWhite(BOARD_BACKGROUNDS.find((b) => b.id === background)!.color);
  const template = BOARD_TEMPLATES.find((t) => t.id === templateId);

  const submit = async () => {
    if (!name.trim()) {
      setError("Donnez un nom à votre board.");
      return;
    }
    setSubmitting(true);
    const copying = templateId === COPY && !!sourceId;
    await onSubmit({
      name: name.trim(),
      desc: desc.trim(),
      background,
      lists: copying ? [] : (template?.lists ?? []),
      idBoardSource: copying ? sourceId! : undefined,
    });
    setSubmitting(false);
  };

  return (
    <View style={styles.form}>
      <View style={[styles.preview, { backgroundColor: preview }]}>
        <View style={styles.previewShine} />
        <AppText variant="title" style={styles.previewText} numberOfLines={1}>
          {name.trim() || "Nouveau board"}
        </AppText>
        <View style={styles.previewLists}>
          {(templateId === COPY ? ["", "", ""] : (template?.lists ?? [])).slice(0, 4).map((list, i) => (
            <View key={i} style={styles.previewList}>
              <AppText variant="micro" style={styles.previewListText} numberOfLines={1}>
                {list}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <TextField
        label="Nom du board"
        placeholder="Ex. Lancement v2"
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (error) setError(null);
        }}
        error={error}
        autoFocus
        maxLength={256}
      />

      <View style={styles.block}>
        <AppText variant="caption" color="textMuted">
          Couleur
        </AppText>
        <View style={styles.swatches}>
          {BOARD_BACKGROUNDS.map((bg) => {
            const selected = bg.id === background;
            return (
              <Pressable
                key={bg.id}
                onPress={() => setBackground(bg.id)}
                accessibilityRole="radio"
                accessibilityLabel={bg.label}
                accessibilityState={{ selected }}
                hitSlop={4}
                style={[styles.swatch, { backgroundColor: bg.color }, selected && styles.swatchSelected]}
              >
                {selected ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.block}>
        <AppText variant="caption" color="textMuted">
          Modèle
        </AppText>
        <View style={styles.templates}>
          {[
            ...BOARD_TEMPLATES,
            ...(existingBoards.length
              ? [{ id: COPY, name: "Copier un board", description: "Reprend ses listes et étiquettes", icon: "copy-outline" as const, lists: [] }]
              : []),
          ].map((t) => {
            const selected = t.id === templateId;
            return (
              <Pressable
                key={t.id}
                onPress={() => setTemplateId(t.id)}
                accessibilityRole="radio"
                accessibilityLabel={`${t.name} : ${t.description}`}
                accessibilityState={{ selected }}
                style={[styles.template, selected && styles.templateSelected]}
              >
                <Ionicons name={t.icon} size={20} color={selected ? colors.primary : colors.textMuted} />
                <AppText variant="bodyStrong" style={selected ? { color: colors.primary } : undefined}>
                  {t.name}
                </AppText>
                <AppText variant="caption" color="textMuted" numberOfLines={2}>
                  {t.description}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {templateId === COPY ? (
        <View style={styles.block}>
          <AppText variant="caption" color="textMuted">
            Board à copier
          </AppText>
          <View style={styles.sources}>
            {existingBoards.map((board) => {
              const selected = board.id === sourceId;
              return (
                <Pressable
                  key={board.id}
                  onPress={() => setSourceId(board.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  style={[styles.source, selected && styles.templateSelected]}
                >
                  <Ionicons
                    name={selected ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={selected ? colors.primary : colors.textSubtle}
                  />
                  <AppText numberOfLines={1} style={styles.sourceName}>
                    {board.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      <TextField label="Description" hint="Facultatif" placeholder="De quoi s'agit-il ?" value={desc} onChangeText={setDesc} multiline />

      <View style={styles.buttons}>
        <Button label="Annuler" variant="ghost" onPress={onCancel} style={styles.button} />
        <Button label="Créer le board" onPress={submit} loading={submitting} style={styles.button} />
      </View>
    </View>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    form: { gap: spacing.lg },
    preview: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, overflow: "hidden" },
    previewShine: {
      position: "absolute",
      top: -50,
      right: -40,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: "rgba(255,255,255,0.14)",
    },
    previewText: { color: "#FFFFFF" },
    previewLists: { flexDirection: "row", gap: spacing.xs + 2, minHeight: 34 },
    previewList: {
      flex: 1,
      height: 34,
      borderRadius: radius.sm,
      backgroundColor: "rgba(255,255,255,0.22)",
      paddingHorizontal: 6,
      paddingTop: 5,
    },
    previewListText: { color: "#FFFFFF" },
    block: { gap: spacing.sm },
    swatches: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm + 2 },
    swatch: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    swatchSelected: { borderWidth: 3, borderColor: colors.text, transform: [{ scale: 1.1 }] },
    templates: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
    template: {
      width: "48%",
      flexGrow: 1,
      gap: 2,
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1.5,
      borderColor: "transparent",
    },
    templateSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
    sources: { gap: spacing.xs + 2 },
    source: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: 44,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1.5,
      borderColor: "transparent",
    },
    sourceName: { flex: 1 },
    buttons: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xs },
    button: { flex: 1 },
  });
