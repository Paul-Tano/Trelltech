import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, RefreshControl, StyleSheet} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getCardById, deleteCard, updateCard } from "@/services/cardService";
import { Card } from "@/types";

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadCard = useCallback(async () => {
    try {
      setError("");
      const data = await getCardById(id);
      setCard(data);
    } catch (e: any) {
      setError(e?.message || "Impossible de charger la carte.");
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      loadCard().finally(() => setLoading(false));
    }
  }, [id, loadCard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCard();
    setRefreshing(false);
  }, [loadCard]);

  const handleDelete = async () => {
    Alert.alert("Supprimer", `Supprimer "${card?.name}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCard(id);
            router.back();
          } catch (e: any) {
            Alert.alert("Erreur", e?.message || "Suppression impossible.");
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    Alert.prompt(
      "Modifier la carte",
      "Nouveau nom",
      async (name) => {
        if (!name?.trim()) return;
        try {
          const updated = await updateCard(id, { name: name.trim() });
          setCard(updated);
        } catch (e: any) {
          Alert.alert("Erreur", e?.message || "Modification impossible.");
        }
      },
      "plain-text",
      card?.name,
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Chargement…" }} />
        <ActivityIndicator size="large" color="#7F77DD" />
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: "Erreur" }} />
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Erreur</Text>
        <Text style={styles.errorMsg}>{error || "Carte introuvable."}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadCard}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Stack.Screen options={{ title: card.name }} />

      <View style={styles.card}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#374151" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        <Text style={styles.cardName}>{card.name}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.desc}>{card.desc || "Pas de description."}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
            <Ionicons name="pencil-outline" size={16} color="#7F77DD" />
            <Text style={styles.editText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={16} color="white" />
            <Text style={styles.deleteText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAF8",
    gap: 12,
    padding: 24,
  },
  errorTitle: { fontSize: 20, fontWeight: "700", color: "#EF4444" },
  errorMsg: { fontSize: 14, color: "#374151", textAlign: "center" },
  retryBtn: {
    backgroundColor: "#EEEDFE",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryText: { fontWeight: "600", color: "#7F77DD" },
  scroll: { flex: 1, backgroundColor: "#FAFAF8" },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
  },
  backText: { fontWeight: "600", color: "#374151" },
  cardName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  desc: { fontSize: 15, color: "#374151", lineHeight: 24, marginBottom: 24 },
  actions: { gap: 12 },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EEEDFE",
    borderRadius: 16,
    paddingVertical: 14,
  },
  editText: { fontWeight: "600", color: "#7F77DD" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EF4444",
    borderRadius: 16,
    paddingVertical: 14,
  },
  deleteText: { fontWeight: "600", color: "white" },
});
