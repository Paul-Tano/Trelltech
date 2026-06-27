import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Member } from "@/types";
import CardForm from "./CardForm";
import api from "@/services/api";
import { removeMemberFromCard } from "@/services/cardService";

type Props = {
  card: Card;
  onEdit: (data: { name: string; desc?: string; memberIds?: string[] }) => void;
  onDelete: () => void;
};

export default function CardDetail({ card, onEdit, onDelete }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const fetchMembers = async () => {
    if (!card.idMembers?.length) {
      setMembers([]);
      return;
    }
    setLoadingMembers(true);
    try {
      const results = await Promise.all(
        card.idMembers.map(async (id) => {
          const res = await api.get(`/members/${id}`);
          return res.data as Member;
        }),
      );
      setMembers(results);
    } catch {
      console.error("Impossible de charger les membres");
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [card.idMembers]);

  const handleRemoveMember = (member: Member) => {
    Alert.alert(
      "Retirer",
      `Retirer ${member.fullName ?? member.username} de cette carte ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Retirer",
          style: "destructive",
          onPress: async () => {
            try {
              await removeMemberFromCard(card.id, member.id);
              setMembers((prev) => prev.filter((m) => m.id !== member.id));
            } catch {
              Alert.alert("Erreur", "Impossible de retirer ce membre.");
            }
          },
        },
      ],
    );
  };

  if (editMode) {
    return (
      <CardForm
        initialValues={{ name: card.name, desc: card.desc }}
        onSubmit={(data) => {
          onEdit(data);
          setEditMode(false);
        }}
        onClose={() => setEditMode(false)}
      />
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.name}>{card.name}</Text>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.desc}>{card.desc || "Aucune description."}</Text>

      <Text style={styles.sectionTitle}>Membres assignés</Text>

      {loadingMembers ? (
        <ActivityIndicator size="small" color="#6B8FAF" />
      ) : members.length === 0 ? (
        <Text style={styles.noMembers}>Aucun membre assigné</Text>
      ) : (
        <View style={styles.membersList}>
          {members.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
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
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemoveMember(member)}
              >
                <Ionicons name="close" size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditMode(true)}
        >
          <Ionicons name="pencil-outline" size={16} color="#0055EE" />
          <Text style={styles.editText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color="white" />
          <Text style={styles.deleteText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 22, fontWeight: "700", color: "#0D1B2E", marginBottom: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B8FAF",
    marginBottom: 8,
    marginTop: 12,
  },
  desc: { fontSize: 14, color: "#0D1B2E", lineHeight: 22 },
  noMembers: { fontSize: 14, color: "#94A3B8" },
  membersList: { gap: 8 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F4F7FB",
    borderRadius: 12,
    padding: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0055EE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "white", fontWeight: "700", fontSize: 14 },
  memberName: { fontSize: 13, fontWeight: "600", color: "#0D1B2E" },
  memberUsername: { fontSize: 11, color: "#6B8FAF" },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(239,68,68,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(0,85,238,0.08)",
    borderRadius: 14,
    padding: 14,
  },
  editText: { fontWeight: "600", color: "#0055EE" },
  deleteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EF4444",
    borderRadius: 14,
    padding: 14,
  },
  deleteText: { fontWeight: "600", color: "white" },
});
