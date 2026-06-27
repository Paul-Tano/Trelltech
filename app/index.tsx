import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("trello_token");
      const key = await AsyncStorage.getItem("trello_key");

      if (token && key) {
        router.replace("/workspaces");
      } else {
        router.replace("/onboarding/token");
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F4F7FB" }}>
      <ActivityIndicator size="large" color="#0055EE" />
    </View>
  );
}