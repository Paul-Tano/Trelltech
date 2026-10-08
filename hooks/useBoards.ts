import { useCallback } from "react";
import { Board, UpdateBoardInput } from "../types";
import { getBoardsByWorkspace, createBoard, deleteBoard, updateBoard } from "../services/boardService";
import { getWorkspaceById } from "../services/workspaceService";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";

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

    const addBoard = async (name: string, desc: string): Promise<boolean> => {
        try {
            const board = await createBoard({ name, desc, idOrganization: workspaceId });
            setBoards((boards) => [...boards, board]);
            haptics.success();
            toast.success("Board créé");
            return true;
        } catch (e) {
            toast.error(errorMessage(e, "Impossible de créer le board."));
            return false;
        }
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

    return {
        ...resource,
        workspace: resource.data?.workspace ?? null,
        boards: resource.data?.boards ?? [],
        addBoard,
        editBoard,
        removeBoard,
    };
};
