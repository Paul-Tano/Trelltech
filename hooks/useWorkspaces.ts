import { useCallback } from "react";
import { Board, CreateWorkspaceInput, UpdateWorkspaceInput } from "../types";
import { getWorkspaces, createWorkspace, deleteWorkspace, updateWorkspace } from "../services/workspaceService";
import { getMyBoards } from "../services/boardService";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";
import { useStar } from "./useStar";

/** Espaces de travail de l'utilisateur + ses boards favoris (affichés sur l'accueil). */
export const useWorkspaces = () => {
    const toast = useToast();
    const fetcher = useCallback(async () => {
        const [workspaces, boards] = await Promise.all([getWorkspaces(), getMyBoards()]);
        return { workspaces, starred: boards.filter((b) => b.starred) };
    }, []);

    const resource = useResource(fetcher, "Impossible de récupérer vos espaces de travail.");
    const { setData } = resource;

    const toggleStar = useStar((idBoard, starred) =>
        setData((prev) => {
            if (!prev) return prev;
            const keep = (b: Board) => b.id !== idBoard || starred;
            return { ...prev, starred: prev.starred.map((b) => (b.id === idBoard ? { ...b, starred } : b)).filter(keep) };
        }),
    );

    const addWorkspace = async (input: CreateWorkspaceInput): Promise<boolean> => {
        try {
            const workspace = await createWorkspace(input);
            setData((prev) => (prev ? { ...prev, workspaces: [...prev.workspaces, workspace] } : prev));
            haptics.success();
            toast.success("Espace de travail créé");
            return true;
        } catch (e) {
            toast.error(errorMessage(e, "Impossible de créer l'espace de travail."));
            return false;
        }
    };

    const editWorkspace = async (id: string, input: UpdateWorkspaceInput): Promise<boolean> => {
        try {
            const updated = await updateWorkspace(id, input);
            setData((prev) =>
                prev ? { ...prev, workspaces: prev.workspaces.map((w) => (w.id === id ? { ...w, ...updated } : w)) } : prev,
            );
            toast.success("Espace de travail modifié");
            return true;
        } catch (e) {
            toast.error(errorMessage(e, "Impossible de modifier l'espace de travail."));
            return false;
        }
    };

    const removeWorkspace = async (id: string): Promise<void> => {
        // Suppression optimiste, annulée si l'API refuse.
        const snapshot = resource.data;
        setData((prev) => (prev ? { ...prev, workspaces: prev.workspaces.filter((w) => w.id !== id) } : prev));
        try {
            await deleteWorkspace(id);
            toast.success("Espace de travail supprimé");
        } catch (e) {
            setData(snapshot);
            toast.error(errorMessage(e, "Impossible de supprimer l'espace de travail."));
        }
    };

    return {
        ...resource,
        workspaces: resource.data?.workspaces ?? [],
        starred: resource.data?.starred ?? [],
        addWorkspace,
        editWorkspace,
        removeWorkspace,
        toggleStar,
    };
};
