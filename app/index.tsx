import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { getCredentials } from "@/services/credentials";
import { useTheme } from "@/hooks/useTheme";

/** Point d'entrée : redirige vers l'app ou vers la connexion selon la présence d'un token. */
export default function Index() {
  const { colors } = useTheme();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getCredentials()
      .then((credentials) => setSignedIn(!!credentials))
      .catch(() => setSignedIn(false));
  }, []);

  if (signedIn === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={signedIn ? "/workspaces" : "/onboarding/token"} />;
}
