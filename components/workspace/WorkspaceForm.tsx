import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { COLORS } from "@/constants/colors";

type Props = {
  loading: boolean;
  onClose: () => void;
  onCreate: (name: string, desc?: string) => void;
};

export default function WorkspaceForm({ loading, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), desc.trim() || undefined);
    setName("");
    setDesc("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom du workspace"
        placeholderTextColor={COLORS.secondary}
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Description (optionnel)"
        placeholderTextColor={COLORS.secondary}
        value={desc}
        onChangeText={setDesc}
        multiline
        numberOfLines={3}
      />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createBtn} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.createText}>Créer</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "rgba(180,151,214,0.2)",
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },
  buttons: { flexDirection: "row", gap: 12, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(180,151,214,0.08)",
    alignItems: "center",
  },
  cancelText: { fontWeight: "600", color: COLORS.secondary },
  createBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: "center",
  },
  createText: { fontWeight: "600", color: COLORS.background },
});
