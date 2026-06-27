import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, Pressable, ScrollView, KeyboardAvoidingView, Platform,} from "react-native";
import { useState } from "react";
import { List, Card } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useCards } from "@/hooks/useCards";
import CardItem from "@/components/card/CardItem";
import CardForm from "@/components/card/CardForm";
import CardDetail from "@/components/card/CardDetail";
import { useRouter } from "expo-router";
import { addMemberToCard } from "@/services/cardService";

type Props = {
  list: List;
  boardId: string;
  onDelete: () => void;
  onEdit: () => void;
};

export default function ListColumn({ list, boardId, onDelete, onEdit }: Props) {
  const router = useRouter();
  const { cards, addCard, editCard, removeCard, refetch } = useCards(list.id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleArchive = () => {
    Alert.alert("Archiver", `Archiver "${list.name}" ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Archiver", style: "destructive", onPress: onDelete },
    ]);
  };

 const handleCreateCard = async (data: {
   name: string;
   desc?: string;
   memberIds?: string[];
 }) => {
   await addCard(
     { name: data.name, idList: list.id, desc: data.desc },
     data.memberIds,
   );
   setShowCreateModal(false);
 };
 const handleEditCard = async (data: {
   name: string;
   desc?: string;
   memberIds?: string[];
 }) => {
   if (!selectedCard) return;

   await editCard(selectedCard.id, {
     name: data.name,
     desc: data.desc,
   });

   if (data.memberIds?.length) {
     await Promise.all(
       data.memberIds.map((memberId) =>
         addMemberToCard(selectedCard.id, memberId),
       ),
     );
     await refetch();
   }

   setSelectedCard(null);
 };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;
    Alert.alert("Supprimer", `Supprimer "${selectedCard.name}" ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await removeCard(selectedCard.id);
          setSelectedCard(null);
        },
      },
    ]);
  };

  return (
    <View style={styles.column}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {list.name}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
            <Ionicons name="pencil-outline" size={14} color={COLORS.accent} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleArchive} style={styles.iconBtn}>
            <Ionicons
              name="archive-outline"
              size={14}
              color={COLORS.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.cardsScroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {cards.length === 0 ? (
          <View style={styles.emptyZone}>
            <Ionicons
              name="layers-outline"
              size={24}
              color="rgba(180,151,214,0.3)"
            />
            <Text style={styles.emptyCards}>Aucune carte</Text>
          </View>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onPress={() => setSelectedCard(card)}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addCardBtn}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add" size={16} color={COLORS.accent} />
        <Text style={styles.addCardText}>Ajouter une carte</Text>
      </TouchableOpacity>

      <Modal visible={showCreateModal} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle carte</Text>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.secondary} />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <CardForm
                onSubmit={handleCreateCard}
                onClose={() => setShowCreateModal(false)}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!selectedCard} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedCard?.name}
              </Text>
              <Pressable onPress={() => setSelectedCard(null)}>
                <Ionicons name="close" size={24} color={COLORS.secondary} />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {selectedCard && (
                <CardDetail
                  card={selectedCard}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                />
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 280,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(180,151,214,0.15)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(180,151,214,0.15)",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  headerActions: { flexDirection: "row", gap: 4 },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(180,151,214,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardsScroll: { maxHeight: 320 },
  emptyZone: { alignItems: "center", gap: 6, paddingVertical: 28 },
  emptyCards: { fontSize: 12, color: "rgba(180,151,214,0.5)" },
  addCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(180,151,214,0.3)",
    justifyContent: "center",
  },
  addCardText: { fontSize: 13, color: COLORS.accent, fontWeight: "500" },
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
    maxHeight: "85%",
    borderTopWidth: 1,
    borderColor: "rgba(180,151,214,0.2)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    marginRight: 12,
  },
});
