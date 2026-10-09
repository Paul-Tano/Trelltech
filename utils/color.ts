import { ACCENT_COLORS, LABEL_COLORS } from "@/constants/theme";

/** Couleur d'accent stable dérivée d'une chaîne (id, nom…). */
export function accentFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return ACCENT_COLORS[Math.abs(hash) % ACCENT_COLORS.length];
}

/** Couleur d'une étiquette Trello ("green_dark" → couleur "green"). */
export function labelColor(color: string | null | undefined): string | null {
  if (!color) return null;
  return LABEL_COLORS[color.split("_")[0]] ?? null;
}

/** Ajoute une opacité à une couleur hexadécimale (#RRGGBB). */
export function withAlpha(hex: string, alpha: number): string {
  const value = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex.slice(0, 7)}${value}`;
}

/** Initiales (2 lettres max) à partir d'un nom. */
export function initials(name: string | null | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return letters.toUpperCase();
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Assombrit une couleur jusqu'à ce que du texte blanc y soit lisible (contraste ≥ 4.5:1).
 * Utile pour les couleurs de board choisies dans Trello (vert clair, ciel…).
 */
export function readableWithWhite(hex: string): string {
  let [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  let current = hex;
  for (let step = 0; step < 12 && 1.05 / (relativeLuminance(current) + 0.05) < 4.5; step++) {
    [r, g, b] = [r, g, b].map((c) => Math.round(c * 0.9));
    current = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  }
  return current;
}
