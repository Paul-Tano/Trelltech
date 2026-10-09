import { useCallback } from "react";
import { addComment, deleteComment, getComments } from "@/services/commentService";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";

/** Commentaires d'une carte (du plus récent au plus ancien). */
export function useComments(cardId: string) {
  const toast = useToast();
  const fetcher = useCallback(() => getComments(cardId), [cardId]);
  const resource = useResource(fetcher, "Impossible de charger les commentaires.");
  const { setData } = resource;

  const post = async (text: string): Promise<boolean> => {
    try {
      const comment = await addComment(cardId, text);
      setData((prev) => [comment, ...(prev ?? [])]);
      haptics.success();
      return true;
    } catch (e) {
      toast.error(errorMessage(e, "Impossible de publier le commentaire."));
      return false;
    }
  };

  const remove = async (commentId: string) => {
    const snapshot = resource.data;
    setData((prev) => prev?.filter((c) => c.id !== commentId) ?? prev);
    try {
      await deleteComment(commentId);
    } catch (e) {
      setData(snapshot);
      toast.error(errorMessage(e, "Impossible de supprimer le commentaire."));
    }
  };

  return { ...resource, comments: resource.data ?? [], post, remove };
}
