import { useCallback } from "react";
import { Card, Member, UpdateCardInput } from "@/types";
import {
  addMemberToCard,
  deleteCard,
  getCardById,
  removeMemberFromCard,
  updateCard,
} from "@/services/cardService";
import { getListsByBoard } from "@/services/listService";
import { getMembersByBoard } from "@/services/memberService";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";

/** Une carte, avec les listes et les membres de son board (pour la déplacer / l'assigner). */
export function useCard(cardId: string) {
  const toast = useToast();
  const fetcher = useCallback(async () => {
    const card = await getCardById(cardId);
    const [lists, members] = await Promise.all([getListsByBoard(card.idBoard), getMembersByBoard(card.idBoard)]);
    return { card, lists, members };
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
    update,
    moveTo,
    toggleMember,
    remove,
  };
}
