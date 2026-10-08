import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Label } from "@/types";
import { LABEL_COLORS, LABEL_TEXT, Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import { labelColor } from "@/utils/color";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import TextField from "@/components/ui/TextField";

type Props = {
  visible: boolean;
  onClose: () => void;
  boardLabels: Label[];
  selectedIds: string[];
  onToggle: (label: Label) => void;
  onCreate: (name: string, color: string) => Promise<boolean>;
};

const COLOR_NAMES: Record<string, string> = {
  green: "Vert",
  yellow: "Jaune",
  orange: "Orange",
  red: "Rouge",
  purple: "Violet",
  blue: "Bleu",
  sky: "Ciel",
  lime: "Vert clair",
  pink: "Rose",
  black: "Gris",
};

/** Ajout / retrait des étiquettes d'une carte, et création d'une nouvelle étiquette du board. */
export default function LabelSheet({ visible, onClose, boardLabels, selectedIds, onToggle, onCreate }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("green");
  const [saving, setSaving] = useState(false);

  const create = async () => {
    setSaving(true);
    const ok = await onCreate(name.trim(), color);
    setSaving(false);
    if (ok) {
      setName("");
      setCreating(false);
    }
  };

  const labels = boardLabels.filter((l) => labelColor(l.color));

  return (
    <Sheet visible={visible} onClose={onClose} title="Étiquettes">
      <View style={styles.list}>
        {labels.length === 0 ? (
          <AppText color="textSubtle">Ce board n&apos;a pas encore d&apos;étiquette.</AppText>
        ) : (
          labels.map((label) => {
            const selected = selectedIds.includes(label.id);
            return (
              <Pressable
                key={label.id}
                onPress={() => onToggle(label)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={label.name || COLOR_NAMES[label.color?.split("_")[0] ?? ""] || "Étiquette"}
                style={styles.row}
              >
                <View style={[styles.box, selected && styles.boxChecked]}>
                  {selected ? <Ionicons name="checkmark" size={16} color={colors.onPrimary} /> : null}
                </View>
                <View style={[styles.label, { backgroundColor: labelColor(label.color)! }]}>
                  <AppText variant="caption" numberOfLines={1} style={{ color: LABEL_TEXT }}>
                    {label.name}
                  </AppText>
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      {creating ? (
        <View style={styles.create}>
          <TextField label="Nom de l'étiquette" placeholder="Ex. Urgent" value={name} onChangeText={setName} autoFocus maxLength={60} />
          <View style={styles.swatches}>
            {Object.entries(LABEL_COLORS).map(([key, hex]) => (
              <Pressable
                key={key}
                onPress={() => setColor(key)}
                accessibilityRole="radio"
                accessibilityLabel={COLOR_NAMES[key]}
                accessibilityState={{ selected: color === key }}
                hitSlop={4}
                style={[styles.swatch, { backgroundColor: hex }, color === key && styles.swatchSelected]}
              >
                {color === key ? <Ionicons name="checkmark" size={16} color={LABEL_TEXT} /> : null}
              </Pressable>
            ))}
          </View>
          <View style={styles.buttons}>
            <Button label="Annuler" variant="ghost" onPress={() => setCreating(false)} style={styles.button} />
            <Button label="Créer" onPress={create} loading={saving} style={styles.button} />
          </View>
        </View>
      ) : (
        <Button label="Créer une étiquette" icon="add" variant="secondary" onPress={() => setCreating(true)} style={styles.newButton} />
      )}
    </Sheet>
  );
}

const makeStyles = ({ colors, radius, spacing }: Theme) =>
  StyleSheet.create({
    list: { gap: spacing.sm },
    row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 44 },
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
    label: { flex: 1, minHeight: 36, borderRadius: radius.sm, justifyContent: "center", paddingHorizontal: spacing.md },
    create: { gap: spacing.lg, marginTop: spacing.xl },
    swatches: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm + 2 },
    swatch: { width: 40, height: 32, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
    swatchSelected: { borderWidth: 2.5, borderColor: colors.text },
    buttons: { flexDirection: "row", gap: spacing.md },
    button: { flex: 1 },
    newButton: { marginTop: spacing.xl },
  });
