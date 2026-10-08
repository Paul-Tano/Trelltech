import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import api, { TRELLO_API_URL } from "./api";
import { authOptions, clearCredentials, getCredentials, saveCredentials } from "./credentials";

const API_KEY = process.env.EXPO_PUBLIC_TRELLO_API_KEY ?? "";
const REDIRECT_URI = process.env.EXPO_PUBLIC_TRELLO_REDIRECT_URI ?? "";

/** Faux si l'app a été compilée sans les variables d'environnement Trello (voir .env.example). */
export const isAuthConfigured = Boolean(API_KEY && REDIRECT_URI);

function buildAuthorizeUrl(): string {
  const params = new URLSearchParams({
    // Token limité dans le temps et sans accès aux paramètres du compte.
    expiration: "30days",
    scope: "read,write",
    response_type: "token",
    key: API_KEY,
    name: "TrellTech",
    return_url: REDIRECT_URI,
    callback_method: "fragment",
  });
  return `https://trello.com/1/authorize?${params.toString()}`;
}

/** Ouvre la page d'autorisation Trello et enregistre le token obtenu. */
export async function signInWithTrello(): Promise<"success" | "cancelled"> {
  if (!isAuthConfigured) {
    throw new Error("Configuration Trello manquante : renseignez EXPO_PUBLIC_TRELLO_API_KEY et EXPO_PUBLIC_TRELLO_REDIRECT_URI.");
  }

  const result = await WebBrowser.openAuthSessionAsync(buildAuthorizeUrl(), REDIRECT_URI);
  if (result.type !== "success") return "cancelled";

  const token = new URLSearchParams(result.url.split("#")[1] ?? "").get("token");
  if (!token) throw new Error("Trello n'a pas renvoyé de token. Réessayez.");

  const credentials = { key: API_KEY, token };
  const { headers, params } = authOptions(credentials);
  try {
    await axios.get(`${TRELLO_API_URL}/members/me`, { headers, params: { ...params, fields: "id" } });
  } catch {
    throw new Error("Le token reçu est invalide. Réessayez.");
  }

  await saveCredentials(credentials);
  return "success";
}

/** Révoque le token côté Trello (au mieux) puis efface les identifiants locaux. */
export async function signOut(): Promise<void> {
  const credentials = await getCredentials();
  if (credentials) {
    try {
      await api.delete(`/tokens/${credentials.token}`);
    } catch {
      // Hors ligne ou token déjà expiré : la déconnexion locale suffit.
    }
  }
  await clearCredentials();
}
