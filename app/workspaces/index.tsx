import { View, Text, FlatList, TouchableOpacity, Modal, Pressable, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import WorkspaceForm from "@/components/workspace/WorkspaceForm";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { getMe } from "@/services/memberService";
import { Member } from "@/types";
import { COLORS } from "@/constants/colors";

export default function WorkspacesScreen() {
  const router = useRouter();
  const { workspaces, loading, addWorkspace, removeWorkspace } =
    useWorkspaces();
  const [modalVisible, setModalVisible] = useState(false);
  const [me, setMe] = useState<Member | null>(null);

  useEffect(() => {
    getMe().then(setMe).catch(console.error);
  }, []);

  const handleCreate = async (name: string, desc?: string) => {
    await addWorkspace({ displayName: name, desc });
    setModalVisible(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/onboarding/token");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <FlatList
          data={workspaces}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                {me?.avatarUrl ? (
                  <Image
                    source={{ uri: `${me.avatarUrl}` }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarLetter}>
                      {me?.fullName?.charAt(0).toUpperCase() ?? "?"}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.profileBtn}
                  onPress={() => router.push("/profile")}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.accent}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.greeting}>
                Hello{" "}
                <Text style={styles.greetingName}>
                  {me?.fullName?.split(" ")[0] ?? ""}
                </Text>{" "}
                !
              </Text>
              <Text style={styles.subtitle}>Gérez vos espaces de travail.</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.newBtn}
                  onPress={() => setModalVisible(true)}
                >
                  <Ionicons name="add" size={16} color={COLORS.background} />
                  <Text style={styles.newBtnText}>New workspace</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={handleLogout}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={COLORS.secondary}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>
                Mes workspaces ({workspaces.length})
              </Text>
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <Ionicons
                  name="albums-outline"
                  size={48}
                  color={COLORS.accent}
                />
                <Text style={styles.emptyText}>Aucun workspace</Text>
                <Text style={styles.emptySubText}>
                  Crée ton premier workspace
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <WorkspaceCard
              workspace={item}
              onPress={() => router.push(`/workspaces/${item.id}`)}
              onDelete={() => removeWorkspace(item.id)}
            />
          )}
        />

        <Modal visible={modalVisible} transparent animationType="slide">
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Nouveau Workspace</Text>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.secondary} />
                </Pressable>
              </View>
              <ScrollView keyboardShouldPersistTaps="handled">
                <WorkspaceForm
                  loading={loading}
                  onClose={() => setModalVisible(false)}
                  onCreate={handleCreate}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  avatarLetter: { color: COLORS.accent, fontSize: 20, fontWeight: "700" },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 32,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  greetingName: { fontWeight: "800", color: COLORS.accent },
  subtitle: { fontSize: 15, color: COLORS.secondary, marginBottom: 24 },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 99,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  newBtnText: { fontSize: 14, fontWeight: "600", color: COLORS.background },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  empty: { alignItems: "center", gap: 8, paddingTop: 60 },
  emptyText: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  emptySubText: { fontSize: 14, color: COLORS.secondary },
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
