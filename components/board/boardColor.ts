import { Board } from "@/types";
import { accentFor, readableWithWhite } from "@/utils/color";

/** Couleur du board définie dans Trello (assombrie si besoin pour le texte blanc), ou couleur d'accent stable. */
export function boardColor(board: Pick<Board, "id" | "prefs">): string {
  const color = board.prefs?.backgroundTopColor ?? board.prefs?.backgroundColor;
  return color && /^#[0-9a-f]{6}$/i.test(color) ? readableWithWhite(color) : accentFor(board.id);
}
