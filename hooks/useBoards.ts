import { useCallback } from "react";
import { Board, UpdateBoardInput, UpdateWorkspaceInput } from "../types";
import { getBoardsByWorkspace, createBoard, deleteBoard, updateBoard } from "../services/boardService";
import { getWorkspaceById, updateWorkspace } from "../services/workspaceService";
import { createList } from "../services/listService";
import { useToast } from "@/components/ui/Toast";
import { CreateBoardValues } from "@/components/board/CreateBoardForm";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";
import { useStar } from "./useStar";

/** Un workspace et ses boards ouverts. */
export const useBoards = (workspaceId: string) => {
    const toast = useToast();
    const fetcher = useCallback(async () => {
        const [workspace, boards] = await Promise.all([
            getWorkspaceById(workspaceId),
            getBoardsByWorkspace(workspaceId),
        ]);
        return { workspace, boards };
    }, [workspaceId]);

    const resource = useResource(fetcher, "Impossible de récupérer les boards.");
    const { setData } = resource;

    const setBoards = (update: (boards: Board[]) => Board[]) =>
        setData((prev) => (prev ? { ...prev, boards: update(prev.boards) } : prev));

    const toggleStar = useStar((idBoard, starred) =>
        setBoards((boards) => boards.map((b) => (b.id === idBoard ? { ...b, starred } : b))),
    );

    const addBoard = async ({ name, desc, background, lists, idBoardSource }: CreateBoardValues): Promise<boolean> => {
        let board: Board;
        try {
            board = await createBoard({ name, desc, background, idBoardSource, idOrganization: workspaceId });
        } catch (e) {
            toast.error(errorMessage(e, "Impossible de créer le board."));
            return false;
        }
        setBoards((boards) => [...boards, board]);
        try {
            // Créées une par une pour respecter l'ordre du modèle.
            for (const list of lists) await createList({ name: list, idBoard: board.id });
            haptics.success();
            toast.success("Board créé");
        } catch (e) {
            toast.error(errorMessage(e, "Board créé, mais certaines listes du modèle n'ont pas pu être ajoutées."));
        }
        return true;
    };

    const editBoard = async (id: string, input: UpdateBoardInput): Promise<boolean> => {
        try {
            const updated = await updateBoard(id, input);
            setBoards((boards) => boards.map((b) => (b.id === id ? { ...b, ...updated } : b)));
            toast.success("Board modifié");
            return true;
        } catch (e) {
            toast.error(errorMessage(e, "Impossible de modifier le board."));
            return false;
        }
    };

    const removeBoard = async (id: string): Promise<void> => {
        const snapshot = resource.data;
        setBoards((boards) => boards.filter((b) => b.id !== id));
        try {
            await deleteBoard(id);
            toast.success("Board supprimé");
        } catch (e) {
            setData(snapshot);
            toast.error(errorMessage(e, "Impossible de supprimer le board."));
        }
    };

    const editWorkspace = async (input: UpdateWorkspaceInput): Promise<boolean> => {
        try {
            const updated = await updateWorkspace(workspaceId, input);
            setData((prev) => (prev ? { ...prev, workspace: { ...prev.workspace, ...updated } } : prev));
            toast.success("Espace de travail modifié");
            return true;
        } catch (e) {
            toast.error(errorMessage(e, "Impossible de modifier l'espace de travail."));
            return false;
        }
    };

    return {
        ...resource,
        workspace: resource.data?.workspace ?? null,
        boards: resource.data?.boards ?? [],
        addBoard,
        editBoard,
        removeBoard,
        toggleStar,
        editWorkspace,
    };
};
