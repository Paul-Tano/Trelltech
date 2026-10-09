import { IconName } from "@/components/ui/IconButton";
import { BoardBackground } from "@/types";

export type BoardTemplate = {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  lists: string[];
};

/** Modèles proposés à la création d'un board : chaque liste est créée dans l'ordre. */
export const BOARD_TEMPLATES: BoardTemplate[] = [
  { id: "empty", name: "Vide", description: "Partir de zéro", icon: "square-outline", lists: [] },
  {
    id: "kanban",
    name: "Kanban",
    description: "À faire, En cours, Terminé",
    icon: "albums-outline",
    lists: ["À faire", "En cours", "Terminé"],
  },
  {
    id: "scrum",
    name: "Scrum",
    description: "Backlog, sprint et revue",
    icon: "repeat-outline",
    lists: ["Backlog", "Sprint en cours", "En cours", "En revue", "Terminé"],
  },
  {
    id: "bugs",
    name: "Suivi de bugs",
    description: "Du signalement à la correction",
    icon: "bug-outline",
    lists: ["Signalés", "À trier", "En correction", "À tester", "Corrigés"],
  },
  {
    id: "personal",
    name: "Projet perso",
    description: "Idées, semaine, fait",
    icon: "bulb-outline",
    lists: ["Idées", "À faire", "Cette semaine", "Fait"],
  },
];

/** Couleurs de fond Trello, dans l'ordre du sélecteur de Trello. */
export const BOARD_BACKGROUNDS: { id: BoardBackground; color: string; label: string }[] = [
  { id: "blue", color: "#0079BF", label: "Bleu" },
  { id: "orange", color: "#D29034", label: "Orange" },
  { id: "green", color: "#519839", label: "Vert" },
  { id: "red", color: "#B04632", label: "Rouge" },
  { id: "purple", color: "#89609E", label: "Violet" },
  { id: "pink", color: "#CD5A91", label: "Rose" },
  { id: "lime", color: "#4BBF6B", label: "Vert clair" },
  { id: "sky", color: "#00AECC", label: "Ciel" },
  { id: "grey", color: "#838C91", label: "Gris" },
];
