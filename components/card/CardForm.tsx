import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMembers } from "@/hooks/useMembers";
import { Member } from "@/types";

type Props = {
  listId?: string;
  loading?: boolean;
  initialValues?: { name?: string; desc?: string };
  onSubmit: (data: {
    name: string;
    desc?: string;
    memberIds?: string[];
  }) => void;
  onClose: () => void;
};

export default function CardForm({
  initialValues,
  onSubmit,
  onClose,
  loading,
}: Props) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [desc, setDesc] = useState(initialValues?.desc ?? "");
  const [error, setError] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  const { members, searchMembers, loading: searchLoading } = useMembers();

  const handleSearch = async () => {
    if (!memberQuery.trim()) return;
    await searchMembers(memberQuery.trim());
  };

  const toggleMember = (member: Member) => {
    setSelectedMembers((prev) =>
      prev.find((m) => m.id === member.id)
        ? prev.filter((m) => m.id !== member.id)
        : [...prev, member],
    );
  };

  const submit = () => {
    if (!name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    setError("");
    onSubmit({
      name: name.trim(),
      desc: desc.trim() || undefined,
      memberIds: selectedMembers.map((m) => m.id),
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de la carte"
        placeholderTextColor="#94A3B8"
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Description (optionnel)"
        placeholderTextColor="#94A3B8"
        value={desc}
        onChangeText={setDesc}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Assigner un membre</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Username Trello"
          placeholderTextColor="#94A3B8"
          value={memberQuery}
          onChangeText={setMemberQuery}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          {searchLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="search" size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {members.map((member) => {
        const isSelected = !!selectedMembers.find((m) => m.id === member.id);
        return (
          <TouchableOpacity
            key={member.id}
            style={[styles.memberRow, isSelected && styles.memberRowSelected]}
            onPress={() => toggleMember(member)}
          >
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>
                {(member.fullName ?? member.username ?? "?")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>
                {member.fullName ?? member.username}
              </Text>
              <Text style={styles.memberUsername}>@{member.username}</Text>
            </View>
            {isSelected && (
              <Ionicons name="checkmark-circle" size={20} color="#0055EE" />
            )}
          </TouchableOpacity>
        );
      })}

      {selectedMembers.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.label}>
            Sélectionnés ({selectedMembers.length})
          </Text>
          {selectedMembers.map((m) => (
            <View key={m.id} style={styles.selectedRow}>
              <Text style={styles.selectedName}>
                {m.fullName ?? m.username}
              </Text>
              <TouchableOpacity onPress={() => toggleMember(m)}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createBtn} onPress={submit}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.createText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B8FAF",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: "#0D1B2E",
    marginBottom: 4,
  },
  textarea: { height: 80, textAlignVertical: "top" },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  searchBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0055EE",
    alignItems: "center",
    justifyContent: "center",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#F4F7FB",
    marginBottom: 6,
  },
  memberRowSelected: {
    backgroundColor: "rgba(0,85,238,0.08)",
    borderWidth: 1,
    borderColor: "#0055EE",
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0055EE",
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: { color: "white", fontWeight: "700", fontSize: 14 },
  memberName: { fontSize: 13, fontWeight: "600", color: "#0D1B2E" },
  memberUsername: { fontSize: 11, color: "#6B8FAF" },
  selectedSection: { marginTop: 4 },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F4F7FB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
  },
  selectedName: { fontSize: 13, color: "#0D1B2E", fontWeight: "500" },
  error: { color: "#EF4444", fontSize: 13, marginTop: 4 },
  buttons: { flexDirection: "row", gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F4F7FB",
    alignItems: "center",
  },
  cancelText: { fontWeight: "600", color: "#6B8FAF" },
  createBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#0055EE",
    alignItems: "center",
  },
  createText: { fontWeight: "600", color: "white" },
});
