import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Workspace } from "@/types";
import { COLORS } from "@/constants/colors";

type Props = {
  workspace: Workspace;
  onPress: () => void;
  onDelete: () => void;
};

export default function WorkspaceCard({ workspace, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.card}>
        <View style={styles.circle} />
        <View style={styles.circleSmall} />

        <View style={styles.content}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>
              {workspace.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {workspace.displayName}
            </Text>
            <Text style={styles.desc} numberOfLines={1}>
              {workspace.desc || "Aucune description"}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.tag}>
            <Ionicons name="albums-outline" size={12} color={COLORS.accent} />
            <Text style={styles.tagText}>Workspace</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="trash-outline"
                size={16}
                color={COLORS.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
              <Ionicons name="arrow-forward" size={16} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    borderRadius: 24,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
    minHeight: 140,
    backgroundColor: COLORS.surface,
  },
  circle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(180,151,214,0.07)",
    top: -40,
    right: -40,
  },
  circleSmall: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(180,151,214,0.05)",
    bottom: -20,
    left: 20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(180,151,214,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 22, fontWeight: "700", color: COLORS.accent },
  info: { flex: 1 },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  desc: { fontSize: 13, color: COLORS.secondary },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(180,151,214,0.12)",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, color: COLORS.accent, fontWeight: "500" },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(180,151,214,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
