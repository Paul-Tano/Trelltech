import { Pressable, Text, View, StyleSheet } from "react-native";
import { Card } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

type Props = {
  card: Card;
  onPress: () => void;
};

export default function CardItem({ card, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.accent} />

      <View style={styles.content}>
        <Text style={styles.name}>{card.name}</Text>
        <View style={styles.footer}>
          <Ionicons name="person-outline" size={11} color={COLORS.accent} />
          <Text style={styles.members}>
            {card.idMembers?.length
              ? `${card.idMembers.length} membre${card.idMembers.length > 1 ? "s" : ""}`
              : "Aucun membre"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(180,151,214,0.1)",
  },
  accent: { width: 3, backgroundColor: COLORS.accent },
  content: { flex: 1, padding: 12, gap: 4 },
  name: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  desc: { fontSize: 11, color: COLORS.secondary, lineHeight: 16 },
  footer: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  members: { fontSize: 11, color: COLORS.accent },
});
