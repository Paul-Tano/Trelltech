import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Theme } from "@/constants/theme";
import { useTheme, useThemedStyles } from "@/hooks/useTheme";
import AppText from "./AppText";
import IconButton from "./IconButton";

type Props = {
  value: Date | null;
  onChange: (date: Date) => void;
};

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Calendrier mensuel (semaine commençant le lundi), sans dépendance native : fonctionne aussi sur le web. */
export default function Calendar({ value, onChange }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const today = new Date();
  const [month, setMonth] = useState(() => {
    const base = value ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Décalage du 1er du mois pour une semaine lundi → dimanche.
  const offset = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  while (cells.length % 7) cells.push(null);

  const shiftMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  const title = month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <View style={styles.calendar}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" size="sm" accessibilityLabel="Mois précédent" onPress={() => shiftMonth(-1)} />
        <AppText variant="bodyStrong" style={styles.title} accessibilityRole="header">
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </AppText>
        <IconButton icon="chevron-forward" size="sm" accessibilityLabel="Mois suivant" onPress={() => shiftMonth(1)} />
      </View>

      <View style={styles.row}>
        {WEEKDAYS.map((day, i) => (
          <AppText key={i} variant="micro" color="textSubtle" align="center" style={styles.cell}>
            {day}
          </AppText>
        ))}
      </View>

      {Array.from({ length: cells.length / 7 }, (_, week) => (
        <View key={week} style={styles.row}>
          {cells.slice(week * 7, week * 7 + 7).map((date, i) => {
            if (!date) return <View key={i} style={styles.cell} />;
            const selected = !!value && sameDay(date, value);
            const isToday = sameDay(date, today);
            return (
              <Pressable
                key={i}
                onPress={() => onChange(date)}
                accessibilityRole="button"
                accessibilityLabel={date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                accessibilityState={{ selected }}
                style={styles.cell}
              >
                <View style={[styles.day, isToday && styles.today, selected && styles.selected]}>
                  <AppText
                    variant="caption"
                    style={{ color: selected ? colors.onPrimary : isToday ? colors.primary : colors.text }}
                  >
                    {date.getDate()}
                  </AppText>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const makeStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    calendar: { gap: spacing.xs },
    header: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
    title: { flex: 1, textAlign: "center" },
    row: { flexDirection: "row" },
    cell: { flex: 1, alignItems: "center", justifyContent: "center", height: 40 },
    day: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    today: { borderWidth: 1.5, borderColor: colors.primary },
    selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  });
