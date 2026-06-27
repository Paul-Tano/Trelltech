import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { COLORS } from "@/constants/colors";

type Props = {
  loading: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  defaultValue?: string; // pré-rempli en mode édition
};

export default function ListForm({
  loading,
  onClose,
  onCreate,
  defaultValue,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (defaultValue) setName(defaultValue);
  }, [defaultValue]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    setName("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom de la liste"
        placeholderTextColor={COLORS.secondary}
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createBtn} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.background} />
          ) : (
            <Text style={styles.createText}>
              {defaultValue ? "Modifier" : "Créer"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: "rgba(180,151,214,0.2)",
  },
  buttons: { flexDirection: "row", gap: 12 },
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
