import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type Credentials = { key: string; token: string };

const KEY = "trello_key";
const TOKEN = "trello_token";

// SecureStore (Keychain / Keystore) n'existe pas sur le web : on se rabat sur AsyncStorage.
const secure = Platform.OS !== "web";

// Évite de relire le stockage chiffré à chaque requête.
let cache: Credentials | null | undefined;

const read = (name: string) => (secure ? SecureStore.getItemAsync(name) : AsyncStorage.getItem(name));
const write = (name: string, value: string) =>
  secure ? SecureStore.setItemAsync(name, value) : AsyncStorage.setItem(name, value);
const remove = (name: string) => (secure ? SecureStore.deleteItemAsync(name) : AsyncStorage.removeItem(name));

export async function getCredentials(): Promise<Credentials | null> {
  if (cache !== undefined) return cache;

  let [key, token] = await Promise.all([read(KEY), read(TOKEN)]);

  if ((!key || !token) && secure) {
    // Les versions précédentes stockaient le token en clair dans AsyncStorage : on le migre puis on l'efface.
    const [legacyKey, legacyToken] = await Promise.all([AsyncStorage.getItem(KEY), AsyncStorage.getItem(TOKEN)]);
    if (legacyKey && legacyToken) {
      await Promise.all([write(KEY, legacyKey), write(TOKEN, legacyToken)]);
      [key, token] = [legacyKey, legacyToken];
    }
    await AsyncStorage.multiRemove([KEY, TOKEN]);
  }

  cache = key && token ? { key, token } : null;
  return cache;
}

export async function saveCredentials(credentials: Credentials): Promise<void> {
  await Promise.all([write(KEY, credentials.key), write(TOKEN, credentials.token)]);
  cache = credentials;
}

export async function clearCredentials(): Promise<void> {
  cache = null;
  await Promise.all([remove(KEY), remove(TOKEN)]);
}

/**
 * Paramètres d'authentification d'une requête Trello.
 * Sur mobile, les identifiants passent dans l'en-tête Authorization pour ne jamais
 * apparaître dans une URL (logs, proxys). Sur le web, on garde les paramètres d'URL,
 * l'en-tête n'étant pas garanti par la politique CORS de l'API Trello.
 */
export function authOptions({ key, token }: Credentials): {
  headers?: Record<string, string>;
  params?: Record<string, string>;
} {
  if (!secure) return { params: { key, token } };
  return { headers: { Authorization: `OAuth oauth_consumer_key="${key}", oauth_token="${token}"` } };
}
