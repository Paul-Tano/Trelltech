import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import AppText from "@/components/ui/AppText";
import Button from "@/components/ui/Button";
import Calendar from "@/components/ui/Calendar";
import Chip from "@/components/ui/Chip";
import Sheet from "@/components/ui/Sheet";

type Props = {
  visible: boolean;
  due: string | null | undefined;
  onClose: () => void;
  /** `null` retire l'échéance. Renvoie `true` si l'enregistrement a réussi. */
  onSave: (due: string | null) => Promise<boolean>;
};

const HOURS = [9, 12, 14, 18];

const atDaysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const QUICK = [
  { label: "Aujourd'hui", days: 0 },
  { label: "Demain", days: 1 },
  { label: "Dans 3 jours", days: 3 },
  { label: "Dans 1 semaine", days: 7 },
];

/** Choix de l'échéance d'une carte : raccourcis, calendrier et heure. */
export default function DueDateSheet({ visible, due, onClose, onSave }: Props) {
  return (
    <Sheet visible={visible} onClose={onClose} title="Échéance">
      {/* Remonté à chaque ouverture pour repartir de l'échéance actuelle. */}
      {visible ? <DueDateForm due={due} onClose={onClose} onSave={onSave} /> : null}
    </Sheet>
  );
}

function DueDateForm({ due, onClose, onSave }: Omit<Props, "visible">) {
  const initial = due ? new Date(due) : null;
  const [date, setDate] = useState<Date | null>(initial);
  const [hour, setHour] = useState(initial ? initial.getHours() : 18);
  const [saving, setSaving] = useState<"save" | "remove" | null>(null);
  // L'heure actuelle de l'échéance reste sélectionnable même si elle n'est pas dans les raccourcis.
  const hours = initial && !HOURS.includes(initial.getHours()) ? [...HOURS, initial.getHours()].sort((a, b) => a - b) : HOURS;

  const save = async () => {
    if (!date) return;
    const result = new Date(date);
    result.setHours(hour, 0, 0, 0);
    setSaving("save");
    const ok = await onSave(result.toISOString());
    setSaving(null);
    if (ok) onClose();
  };

  const remove = async () => {
    setSaving("remove");
    const ok = await onSave(null);
    setSaving(null);
    if (ok) onClose();
  };

  return (
    <View style={styles.form}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {QUICK.map((quick) => {
          const target = atDaysFromNow(quick.days);
          return (
            <Chip
              key={quick.label}
              label={quick.label}
              selected={!!date && date.toDateString() === target.toDateString()}
              onPress={() => setDate(target)}
            />
          );
        })}
      </ScrollView>

      <Calendar value={date} onChange={setDate} />

      <View style={styles.block}>
        <AppText variant="caption" color="textMuted">
          Heure
        </AppText>
        <View style={styles.chips}>
          {hours.map((h) => (
            <Chip key={h} label={`${h} h`} selected={hour === h} onPress={() => setHour(h)} />
          ))}
        </View>
      </View>

      <View style={styles.buttons}>
        {due ? (
          <Button
            label="Retirer"
            icon="trash-outline"
            variant="danger"
            onPress={remove}
            loading={saving === "remove"}
            style={styles.button}
          />
        ) : (
          <Button label="Annuler" variant="ghost" onPress={onClose} style={styles.button} />
        )}
        <Button label="Enregistrer" onPress={save} disabled={!date} loading={saving === "save"} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  block: { gap: spacing.sm },
  buttons: { flexDirection: "row", gap: spacing.md },
  button: { flex: 1 },
});
