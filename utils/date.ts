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


/** "à l'instant", "il y a 5 min", "il y a 3 h", "hier", puis la date. */
export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  if (hours < 48) return "hier";
  return formatDue(iso);
}
