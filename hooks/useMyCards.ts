import { useCallback, useMemo } from "react";
import { Board, Card } from "@/types";
import { getMyCards } from "@/services/cardService";
import { getMyBoards } from "@/services/boardService";
import { useResource } from "./useResource";

export type MyCardGroupKey = "overdue" | "today" | "week" | "later" | "none" | "done";

export type MyCardGroup = { key: MyCardGroupKey; title: string; data: Card[] };

const TITLES: Record<MyCardGroupKey, string> = {
  overdue: "En retard",
  today: "Aujourd'hui",
  week: "Dans les 7 jours",
  later: "Plus tard",
  none: "Sans échéance",
  done: "Terminées",
};

function groupOf(card: Card, now: Date): MyCardGroupKey {
  if (!card.due) return "none";
  if (card.dueComplete) return "done";
  const due = new Date(card.due);
  if (due < now) return "overdue";
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  if (due <= endOfToday) return "today";
  if (due.getTime() - now.getTime() <= 7 * 24 * 3600 * 1000) return "week";
  return "later";
}

/** Cartes assignées à l'utilisateur, regroupées par urgence d'échéance. */
export function useMyCards() {
  const fetcher = useCallback(async () => {
    const [cards, boards] = await Promise.all([getMyCards(), getMyBoards()]);
    return { cards, boards };
  }, []);
  const resource = useResource(fetcher, "Impossible de charger vos cartes.");

  const { groups, boardsById, counts } = useMemo(() => {
    const now = new Date();
    const buckets: Record<MyCardGroupKey, Card[]> = { overdue: [], today: [], week: [], later: [], none: [], done: [] };
    for (const card of resource.data?.cards ?? []) buckets[groupOf(card, now)].push(card);

    const byDue = (a: Card, b: Card) => new Date(a.due ?? 0).getTime() - new Date(b.due ?? 0).getTime();
    (Object.keys(buckets) as MyCardGroupKey[]).forEach((key) => {
      if (key !== "none") buckets[key].sort(byDue);
    });

    return {
      groups: (Object.keys(TITLES) as MyCardGroupKey[])
        .map((key) => ({ key, title: TITLES[key], data: buckets[key] }))
        .filter((group) => group.data.length > 0) as MyCardGroup[],
      boardsById: new Map<string, Board>((resource.data?.boards ?? []).map((b) => [b.id, b])),
      counts: {
        overdue: buckets.overdue.length,
        today: buckets.today.length,
        week: buckets.week.length,
        total: resource.data?.cards.length ?? 0,
      },
    };
  }, [resource.data]);

  return { ...resource, groups, boardsById, counts };
}
