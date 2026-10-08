import { isAxiosError } from "axios";

/** Transforme une erreur réseau/API en message compréhensible par l'utilisateur. */
export function errorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    if (!error.response) return "Connexion impossible. Vérifiez votre réseau.";
    if (error.response.status === 429) return "Trop de requêtes. Réessayez dans quelques secondes.";
    if (error.response.status === 404) return "Élément introuvable : il a peut-être été supprimé.";
  }
  return fallback;
}
