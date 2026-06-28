import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInUp } from "react-native-reanimated";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const API_KEY = process.env.EXPO_PUBLIC_TRELLO_API_KEY!;
const REDIRECT_URI = process.env.EXPO_PUBLIC_TRELLO_REDIRECT_URI!;


const FEATURES = [
  { icon: "albums-outline" as const, label: "Gérez vos workspaces" },
  { icon: "clipboard-outline" as const, label: "Organisez vos boards" },
  { icon: "list-outline" as const, label: "Suivez vos tâches" },
];

const C = {
  background: "#FFFFFF",
  surface: "#F4F6FA",
  accent: "#6C47FF",
  text: "#0D0D0D",
  secondary: "#7A7A9D",
};

export default function TokenScreen() {
  const router = useRouter();

  const openTrelloAuth = async () => {
    const authUrl =
      `https://trello.com/1/authorize` +
      `?expiration=never` +
      `&scope=read,write,account` +
      `&response_type=token` +
      `&key=${API_KEY}` +
      `&name=TrellTech` +
      `&return_url=${encodeURIComponent(REDIRECT_URI)}` +
      `&callback_method=fragment`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

    if (result.type === "success" && result.url) {
      const fragment = result.url.split("#")[1];
      const params = new URLSearchParams(fragment);
      const token = params.get("token");

      if (token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          await AsyncStorage.setItem("trello_token", token);
          await AsyncStorage.setItem("trello_key", API_KEY);
          router.replace("/workspaces");
        } else {
          Alert.alert("Erreur", "Token invalide. Réessaie.");
        }
      }
    } else {
      Alert.alert("Erreur", "Authentification annulée. Réessaie.");
    }
  };

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/members/me?key=${API_KEY}&token=${token}`,
      );
      return response.ok;
    } catch {
      return false;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />

        <View style={styles.content}>
          {/* Titre */}
          <Animated.View
            entering={FadeInUp.duration(500).delay(200)}
            style={styles.titleSection}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="albums-outline" size={40} color={C.accent} />
            </View>
            <Text style={styles.title}>TrellTech</Text>
            <Text style={styles.subtitle}>
              Gérez vos projets simplement.{"\n"}
              Connectez-vous avec votre compte Trello.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(500).delay(400)}
            style={styles.featuresSection}
          >
            {FEATURES.map((item, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={item.icon} size={18} color={C.accent} />
                </View>
                <Text style={styles.featureText}>{item.label}</Text>
              </View>
            ))}
          </Animated.View>
          <Animated.View
            entering={FadeInUp.duration(500).delay(600)}
            style={styles.bottomSection}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={openTrelloAuth}
              activeOpacity={0.85}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>Se connecter avec Trello</Text>
            </TouchableOpacity>
            <Text style={styles.footer}>
              En continuant, tu autorises TrellTech à accéder{"\n"}à ton compte
              Trello en lecture et écriture.
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  circleTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#6C47FF",
    opacity: 0.06,
  },
  circleBottom: {
    position: "absolute",
    bottom: -60,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#6C47FF",
    opacity: 0.06,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  titleSection: { alignItems: "center", gap: 12 },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: "#F0ECFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    color: "#0D0D0D",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#7A7A9D",
    textAlign: "center",
    lineHeight: 24,
  },
  featuresSection: { gap: 12 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EDE8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { color: "#0D0D0D", fontSize: 14, fontWeight: "500" },
  bottomSection: { gap: 16 },
  button: {
    backgroundColor: "#6C47FF",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  footer: {
    color: "#7A7A9D",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
