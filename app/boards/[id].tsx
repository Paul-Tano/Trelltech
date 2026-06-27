import { View, Text, ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator, StyleSheet, KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLists } from "@/hooks/useLists";
import ListColumn from "@/components/list/ListColumn";
import ListForm from "@/components/list/ListForm";
import { List } from "@/types";
import { COLORS } from "@/constants/colors";

export default function BoardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { lists, loading, error, addList, removeList, editList } = useLists(id);

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [listToEdit, setListToEdit] = useState<List | null>(null);

  const handleCreate = async (name: string) => {
    await addList({ name, idBoard: id });
    setCreateModal(false);
  };

  const handleEdit = async (name: string) => {
    if (!listToEdit) return;
    await editList(listToEdit.id, { name });
    setEditModal(false);
    setListToEdit(null);
  };

  const openEditModal = (list: List) => {
    setListToEdit(list);
    setEditModal(true);
  };

  if (loading && lists.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={COLORS.secondary}
        />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Board</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setCreateModal(true)}
          >
            <Ionicons name="add" size={22} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        {lists.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="list-outline" size={48} color={COLORS.accent} />
            <Text style={styles.emptyText}>Aucune liste</Text>
            <Text style={styles.emptySubText}>Crée ta première liste</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.columnsContent}
          >
            {lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                boardId={id}
                onDelete={() => removeList(list.id)}
                onEdit={() => openEditModal(list)}
              />
            ))}
          </ScrollView>
        )}

        <TouchableOpacity
          style={styles.newListBtn}
          onPress={() => setCreateModal(true)}
        >
          <Ionicons name="add" size={18} color={COLORS.background} />
          <Text style={styles.newListText}>Ajouter une liste</Text>
        </TouchableOpacity>
        <Modal visible={createModal} transparent animationType="slide">
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nouvelle liste</Text>
                <Pressable onPress={() => setCreateModal(false)}>
                  <Ionicons name="close" size={24} color={COLORS.secondary} />
                </Pressable>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled">
                <ListForm
                  loading={loading}
                  onClose={() => setCreateModal(false)}
                  onCreate={handleCreate}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <Modal visible={editModal} transparent animationType="slide">
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Modifier la liste</Text>
                <Pressable
                  onPress={() => {
                    setEditModal(false);
                    setListToEdit(null);
                  }}
                >
                  <Ionicons name="close" size={24} color={COLORS.secondary} />
                </Pressable>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled">
                <ListForm
                  loading={loading}
                  onClose={() => {
                    setEditModal(false);
                    setListToEdit(null);
                  }}
                  onCreate={handleEdit}
                  defaultValue={listToEdit?.name}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(180,151,214,0.15)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(180,151,214,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  columnsContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
    gap: 12,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyText: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  emptySubText: { fontSize: 14, color: COLORS.secondary },
  errorText: { color: COLORS.secondary, fontSize: 14 },
  newListBtn: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  newListText: { fontSize: 14, fontWeight: "600", color: COLORS.background },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text },
});
