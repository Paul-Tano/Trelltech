import { useCallback } from "react";
import { ListWithCards } from "@/types";
import { getBoardById } from "@/services/boardService";
import { archiveList, createList, getListsWithCards, updateList } from "@/services/listService";
import { createCard } from "@/services/cardService";
import { getMembersByBoard } from "@/services/memberService";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";
import { useStar } from "./useStar";

/**
 * Un board complet : infos, listes avec leurs cartes et membres.
 * Trois requêtes en parallèle au lieu d'une requête par liste.
 */
export function useBoard(boardId: string) {
  const toast = useToast();
  const fetcher = useCallback(async () => {
    const [board, lists, members] = await Promise.all([
      getBoardById(boardId),
      getListsWithCards(boardId),
      getMembersByBoard(boardId),
    ]);
    return { board, lists, members };
  }, [boardId]);

  const resource = useResource(fetcher, "Impossible de charger ce board.");
  const { setData } = resource;

  const toggleStar = useStar((_idBoard, starred) =>
    setData((prev) => (prev ? { ...prev, board: { ...prev.board, starred } } : prev)),
  );

  const setLists = (update: (lists: ListWithCards[]) => ListWithCards[]) =>
    setData((prev) => (prev ? { ...prev, lists: update(prev.lists) } : prev));

  const addList = async (name: string): Promise<boolean> => {
    try {
      const list = await createList({ name, idBoard: boardId });
      setLists((lists) => [...lists, { ...list, cards: [] }]);
      haptics.success();
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Impossible de créer la liste."));
      return false;
    }
  };

  const renameList = async (id: string, name: string): Promise<boolean> => {
    try {
      await updateList(id, { name });
      setLists((lists) => lists.map((l) => (l.id === id ? { ...l, name } : l)));
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Impossible de renommer la liste."));
      return false;
    }
  };

  const removeList = async (id: string): Promise<void> => {
    const snapshot = resource.data;
    setLists((lists) => lists.filter((l) => l.id !== id));
    try {
      await archiveList(id);
      toast.success("Liste archivée");
    } catch (e) {
      setData(snapshot);
      toast.error(errorMessage(e, "Impossible d'archiver la liste."));
    }
  };

  const addCard = async (idList: string, name: string, desc: string): Promise<boolean> => {
    try {
      const card = await createCard({ idList, name, desc });
      setLists((lists) => lists.map((l) => (l.id === idList ? { ...l, cards: [...l.cards, card] } : l)));
      haptics.success();
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Impossible de créer la carte."));
      return false;
    }
  };

  return {
    ...resource,
    board: resource.data?.board ?? null,
    lists: resource.data?.lists ?? [],
    members: resource.data?.members ?? [],
    addList,
    renameList,
    removeList,
    addCard,
    toggleStar,
  };
}
