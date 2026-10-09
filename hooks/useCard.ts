import { useCallback } from "react";
import { Card, Label, Member, UpdateCardInput } from "@/types";
import {
  addMemberToCard,
  deleteCard,
  getCardById,
  removeMemberFromCard,
  updateCard,
} from "@/services/cardService";
import { getListsByBoard } from "@/services/listService";
import { getMembersByBoard } from "@/services/memberService";
import { addLabelToCard, createLabel, getBoardLabels, removeLabelFromCard } from "@/services/labelService";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";

/** Une carte, avec les listes, membres et étiquettes de son board (pour la déplacer, l'assigner, l'étiqueter). */
export function useCard(cardId: string) {
  const toast = useToast();
  const fetcher = useCallback(async () => {
    const card = await getCardById(cardId);
    const [lists, members, labels] = await Promise.all([
      getListsByBoard(card.idBoard),
      getMembersByBoard(card.idBoard),
      getBoardLabels(card.idBoard),
    ]);
    return { card, lists, members, labels };
  }, [cardId]);

  const resource = useResource(fetcher, "Impossible de charger cette carte.");
  const { setData } = resource;

  const patchCard = (patch: Partial<Card>) =>
    setData((prev) => (prev ? { ...prev, card: { ...prev.card, ...patch } } : prev));

  /** Mise à jour optimiste : l'interface réagit tout de suite, puis est corrigée si l'API refuse. */
  const optimistic = async (patch: Partial<Card>, request: () => Promise<unknown>, failure: string) => {
    const snapshot = resource.data;
    patchCard(patch);
    try {
      await request();
      return true;
    } catch (e) {
      setData(snapshot);
      toast.error(errorMessage(e, failure));
      return false;
    }
  };

  const update = (input: Pick<UpdateCardInput, "name" | "desc" | "dueComplete">) =>
    optimistic(input, () => updateCard(cardId, input), "Impossible de modifier la carte.");

  const moveTo = async (idList: string) => {
    const ok = await optimistic(
      { idList },
      () => updateCard(cardId, { idList, pos: "bottom" }),
      "Impossible de déplacer la carte.",
    );
    if (ok) haptics.tap();
  };

  const toggleMember = (member: Member) => {
    const card = resource.data?.card;
    if (!card) return;
    const assigned = card.idMembers.includes(member.id);
    haptics.tap();
    return optimistic(
      { idMembers: assigned ? card.idMembers.filter((id) => id !== member.id) : [...card.idMembers, member.id] },
      () => (assigned ? removeMemberFromCard(cardId, member.id) : addMemberToCard(cardId, member.id)),
      assigned ? "Impossible de retirer ce membre." : "Impossible d'assigner ce membre.",
    );
  };

  /** Définit (date ISO) ou retire (`null`) l'échéance. */
  const setDue = (due: string | null) =>
    optimistic(
      { due, dueComplete: due ? resource.data?.card.dueComplete : false },
      () => updateCard(cardId, due ? { due } : { due: null, dueComplete: false }),
      "Impossible de modifier l'échéance.",
    );

  const toggleLabel = (label: Label) => {
    const card = resource.data?.card;
    if (!card) return;
    const labels = card.labels ?? [];
    const applied = labels.some((l) => l.id === label.id);
    haptics.tap();
    return optimistic(
      { labels: applied ? labels.filter((l) => l.id !== label.id) : [...labels, label] },
      () => (applied ? removeLabelFromCard(cardId, label.id) : addLabelToCard(cardId, label.id)),
      applied ? "Impossible de retirer l'étiquette." : "Impossible d'ajouter l'étiquette.",
    );
  };

  /** Crée une étiquette sur le board puis l'applique à la carte. */
  const createAndApplyLabel = async (name: string, color: string): Promise<boolean> => {
    const card = resource.data?.card;
    if (!card) return false;
    try {
      const label = await createLabel(card.idBoard, name, color);
      await addLabelToCard(cardId, label.id);
      setData((prev) =>
        prev
          ? {
              ...prev,
              labels: [...prev.labels, label],
              card: { ...prev.card, labels: [...(prev.card.labels ?? []), label] },
            }
          : prev,
      );
      haptics.success();
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Impossible de créer l'étiquette."));
      return false;
    }
  };

  const remove = async (): Promise<boolean> => {
    try {
      await deleteCard(cardId);
      toast.success("Carte supprimée");
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Impossible de supprimer la carte."));
      return false;
    }
  };

  return {
    ...resource,
    card: resource.data?.card ?? null,
    lists: resource.data?.lists ?? [],
    members: resource.data?.members ?? [],
    boardLabels: resource.data?.labels ?? [],
    update,
    setDue,
    toggleLabel,
    createAndApplyLabel,
    moveTo,
    toggleMember,
    remove,
  };
}
