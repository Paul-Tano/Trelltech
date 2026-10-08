import { StyleSheet, View } from "react-native";
import { LABEL_TEXT } from "@/constants/theme";
import { Label } from "@/types";
import { labelColor } from "@/utils/color";
import AppText from "@/components/ui/AppText";

type Props = { label: Label; compact?: boolean };

/** Étiquette Trello : barre colorée (compacte) ou pastille avec son nom. */
export default function LabelPill({ label, compact }: Props) {
  const color = labelColor(label.color);
  if (!color) return null;

  if (compact && !label.name) {
    return <View style={[styles.bar, { backgroundColor: color }]} accessibilityLabel="Étiquette" />;
  }

  return (
    <View style={[styles.pill, compact && styles.compact, { backgroundColor: color }]} accessibilityLabel={`Étiquette ${label.name}`}>
      <AppText variant="micro" numberOfLines={1} style={styles.text}>
        {label.name || " "}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { width: 36, height: 8, borderRadius: 4 },
  pill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, maxWidth: 160 },
  compact: { paddingHorizontal: 6, paddingVertical: 2 },
  text: { color: LABEL_TEXT },
});
