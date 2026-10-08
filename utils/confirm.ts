import { Alert, Platform } from "react-native";

type Options = {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
};

/** Demande une confirmation avant une action irréversible. Résout `true` si l'utilisateur confirme. */
export function confirm({ title, message, confirmLabel, destructive = true }: Options): Promise<boolean> {
  if (Platform.OS === "web") {
    // Alert.alert ne gère pas les boutons sur le web.
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Annuler", style: "cancel", onPress: () => resolve(false) },
        { text: confirmLabel, style: destructive ? "destructive" : "default", onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
