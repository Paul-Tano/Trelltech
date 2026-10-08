export type DueStatus = "done" | "overdue" | "soon" | "later";

const DAY = 24 * 60 * 60 * 1000;

export function dueStatus(due: string, dueComplete?: boolean): DueStatus {
  if (dueComplete) return "done";
  const diff = new Date(due).getTime() - Date.now();
  if (diff < 0) return "overdue";
  if (diff < DAY) return "soon";
  return "later";
}

/** "12 oct." ou "12 oct. 2027" si l'année diffère. */
export function formatDue(due: string): string {
  const date = new Date(due);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

