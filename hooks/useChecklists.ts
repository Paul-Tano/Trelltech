import { useCallback } from "react";
import { CheckItem, Checklist } from "@/types";
import {
  addCheckItem,
  createChecklist,
  deleteCheckItem,
  deleteChecklist,
  getChecklists,
  setCheckItemState,
} from "@/services/checklistService";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";

/** Checklists d'une carte et leurs éléments. */
export function useChecklists(cardId: string) {
  const toast = useToast();
  const fetcher = useCallback(() => getChecklists(cardId), [cardId]);
  const resource = useResource(fetcher, "Impossible de charger les checklists.");
  const { setData } = resource;

  const updateList = (checklistId: string, update: (checklist: Checklist) => Checklist) =>
    setData((prev) => prev?.map((c) => (c.id === checklistId ? update(c) : c)) ?? prev);

  const fail = (e: unknown, message: string) => toast.error(errorMessage(e, message));

  const addChecklist = async (name: string): Promise<boolean> => {
    try {
      const checklist = await createChecklist(cardId, name);
      setData((prev) => [...(prev ?? []), checklist]);
      return true;
    } catch (e) {
      fail(e, "Impossible de créer la checklist.");
      return false;
    }
  };

  const removeChecklist = async (checklistId: string) => {
    const snapshot = resource.data;
    setData((prev) => prev?.filter((c) => c.id !== checklistId) ?? prev);
    try {
      await deleteChecklist(checklistId);
    } catch (e) {
      setData(snapshot);
      fail(e, "Impossible de supprimer la checklist.");
    }
  };

  const addItem = async (checklistId: string, name: string): Promise<boolean> => {
    try {
      const item = await addCheckItem(checklistId, name);
      updateList(checklistId, (c) => ({ ...c, checkItems: [...c.checkItems, item] }));
      return true;
    } catch (e) {
      fail(e, "Impossible d'ajouter l'élément.");
      return false;
    }
  };

  const toggleItem = async (checklistId: string, item: CheckItem) => {
    const complete = item.state !== "complete";
    const apply = (state: CheckItem["state"]) =>
      updateList(checklistId, (c) => ({
        ...c,
        checkItems: c.checkItems.map((i) => (i.id === item.id ? { ...i, state } : i)),
      }));
    apply(complete ? "complete" : "incomplete");
    haptics.tap();
    try {
      await setCheckItemState(cardId, item.id, complete);
    } catch (e) {
      apply(item.state);
      fail(e, "Impossible de mettre à jour l'élément.");
    }
  };

  const removeItem = async (checklistId: string, itemId: string) => {
    const snapshot = resource.data;
    updateList(checklistId, (c) => ({ ...c, checkItems: c.checkItems.filter((i) => i.id !== itemId) }));
    try {
      await deleteCheckItem(checklistId, itemId);
    } catch (e) {
      setData(snapshot);
      fail(e, "Impossible de supprimer l'élément.");
    }
  };

  return {
    ...resource,
    checklists: resource.data ?? [],
    addChecklist,
    removeChecklist,
    addItem,
    toggleItem,
    removeItem,
  };
}
