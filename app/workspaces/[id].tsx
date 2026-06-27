import { View, Text, FlatList, TouchableOpacity, Modal, Pressable, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useBoards } from "@/hooks/useBoards";
import BoardForm from "@/components/board/BoardForm";
import { Board } from "@/types";
import { COLORS } from "@/constants/colors";
import { getWorkspaceById } from "@/services/workspaceService";
import { Workspace } from "@/types";



export default function WorkspaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
const [workspace, setWorkspace] = useState<Workspace | null>(null);

useEffect(() => {
  getWorkspaceById(id).then(setWorkspace).catch(console.error);
}, [id]);  const { boards, loading, error, addBoard, removeBoard, editBoard } =
    useBoards(id);

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<Board | null>(null);

  const handleCreate = async (name: string, desc?: string) => {
    await addBoard({ name, idOrganization: id, desc });
    setCreateModal(false);
  };

  const handleEdit = async (name: string, desc?: string) => {
    if (!boardToEdit) return;
    await editBoard(boardToEdit.id, { name, desc });
    setEditModal(false);
    setBoardToEdit(null);
  };

  const openEditModal = (board: Board) => {
    setBoardToEdit(board);
    setEditModal(true);
  };

  if (loading && boards.length === 0) {
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

  const renderBoardItem = ({ item }: { item: Board }) => (
    <TouchableOpacity
      style={styles.boardTile}
      onPress={() => router.push(`/boards/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.boardTileTop}>
        <Text style={styles.boardTileLetter}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.boardTileBottom}>
        <Text style={styles.boardTileName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.desc ? (
          <Text style={styles.boardTileDesc} numberOfLines={1}>
            {item.desc}
          </Text>
        ) : null}
        <View style={styles.boardTileActions}>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil-outline" size={14} color={COLORS.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeBoard(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={14} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{workspace?.displayName}</Text>
            <Text style={styles.headerCount}>
              {boards.length} board{boards.length > 1 ? "s" : ""}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setCreateModal(true)}
          >
            <Ionicons name="add" size={22} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={boards}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={renderBoardItem}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <Ionicons name="grid-outline" size={56} color={COLORS.accent} />
                <Text style={styles.emptyText}>Aucun board</Text>
                <Text style={styles.emptySubText}>Crée ton premier board</Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => setCreateModal(true)}
                >
                  <Text style={styles.emptyBtnText}>+ Nouveau Board</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
        <Modal visible={createModal} transparent animationType="slide">
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nouveau Board</Text>
                <Pressable onPress={() => setCreateModal(false)}>
                  <Ionicons name="close" size={24} color={COLORS.secondary} />
                </Pressable>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled">
                <BoardForm
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
                <Text style={styles.modalTitle}>Modifier le Board</Text>
                <Pressable
                  onPress={() => {
                    setEditModal(false);
                    setBoardToEdit(null);
                  }}
                >
                  <Ionicons name="close" size={24} color={COLORS.secondary} />
                </Pressable>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled">
                <BoardForm
                  loading={loading}
                  onClose={() => {
                    setEditModal(false);
                    setBoardToEdit(null);
                  }}
                  onEdit={handleEdit}
                  boardToEdit={boardToEdit}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
}

const TILE_SIZE = 160;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: COLORS.background,
  },
  errorText: { color: COLORS.secondary, fontSize: 14 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
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
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  headerCount: { fontSize: 12, color: COLORS.secondary, marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: { padding: 16, paddingBottom: 100 },
  row: { justifyContent: "space-between", marginBottom: 16 },
  boardTile: {
    width: TILE_SIZE,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(180,151,214,0.15)",
  },
  boardTileTop: {
    height: 90,
    backgroundColor: "rgba(180,151,214,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  boardTileLetter: { fontSize: 36, fontWeight: "800", color: COLORS.accent },
  boardTileBottom: { padding: 12, gap: 4 },
  boardTileName: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  boardTileDesc: { fontSize: 12, color: COLORS.secondary },
  boardTileActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  empty: { alignItems: "center", gap: 12, paddingTop: 80 },
  emptyText: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  emptySubText: { fontSize: 14, color: COLORS.secondary },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyBtnText: { fontSize: 14, fontWeight: "600", color: COLORS.background },
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
