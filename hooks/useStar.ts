import { useToast } from "@/components/ui/Toast";
import { starBoard, unstarBoard } from "@/services/boardService";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";

/**
 * Ajoute / retire un board des favoris, de façon optimiste.
 * `apply` met à jour l'état local de l'écran appelant.
 */
export function useStar(apply: (idBoard: string, starred: boolean) => void) {
  const toast = useToast();

  return async (idBoard: string, starred: boolean) => {
    const next = !starred;
    apply(idBoard, next);
    haptics.tap();
    try {
      await (next ? starBoard(idBoard) : unstarBoard(idBoard));
      toast.success(next ? "Ajouté aux favoris" : "Retiré des favoris");
    } catch (e) {
      apply(idBoard, starred);
      toast.error(errorMessage(e, "Impossible de modifier les favoris."));
    }
  };
}
