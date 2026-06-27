import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMe } from "@/services/memberService";
import { Member } from "@/types";
import { COLORS } from "@/constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const [me, setMe] = useState<Member | null>(null);

  useEffect(() => {
    getMe().then(setMe).catch(console.error);
  }, []);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Tu vas être déconnecté de TrellTech.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/onboarding/token");
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.avatarSection}>
            {me?.avatarUrl ? (
              <Image
                source={{ uri: `${me.avatarUrl}/170.png` }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarLetter}>
                  {me?.fullName?.charAt(0).toUpperCase() ?? "?"}
                </Text>
              </View>
            )}
            <Text style={styles.name}>{me?.fullName ?? "—"}</Text>
            <Text style={styles.username}>@{me?.username ?? "—"}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={COLORS.accent}
                />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Nom complet</Text>
                <Text style={styles.infoValue}>{me?.fullName ?? "—"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="at-outline" size={18} color={COLORS.accent} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Nom d'utilisateur</Text>
                <Text style={styles.infoValue}>@{me?.username ?? "—"}</Text>
              </View>
            </View>

            {me?.email ? (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color={COLORS.accent}
                    />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{me.email}</Text>
                  </View>
                </View>
              </>
            ) : null}
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={COLORS.background}
            />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 40, gap: 24 },
  avatarSection: { alignItems: "center", gap: 12 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.accent,
  },
  avatarLetter: { fontSize: 40, fontWeight: "800", color: COLORS.accent },
  name: { fontSize: 22, fontWeight: "700", color: COLORS.text },
  username: { fontSize: 14, color: COLORS.secondary },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(180,151,214,0.15)",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(180,151,214,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 12, color: COLORS.secondary },
  infoValue: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  divider: {
    height: 1,
    backgroundColor: "rgba(180,151,214,0.1)",
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#C0392B",
    borderRadius: 16,
    paddingVertical: 16,
  },
  logoutText: { fontSize: 16, fontWeight: "700", color: COLORS.background },
});
