import { CreateWorkspaceInput } from "../types";
import { getWorkspaces, createWorkspace, deleteWorkspace } from "../services/workspaceService";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/errors";
import { haptics } from "@/utils/haptics";
import { useResource } from "./useResource";

export const useWorkspaces = () => {
    const toast = useToast();
    const resource = useResource(getWorkspaces, "Impossible de récupérer vos espaces de travail.");
    const { setData } = resource;

    const addWorkspace = async (input: CreateWorkspaceInput): Promise<boolean> => {
        try {
            const workspace = await createWorkspace(input);
            setData((prev) => [...(prev ?? []), workspace]);
            haptics.success();
            toast.success("Espace de travail créé");
            return true;
        } catch (e) {
            toast.error(errorMessage(e, "Impossible de créer l'espace de travail."));
            return false;
        }
    };

    const removeWorkspace = async (id: string): Promise<void> => {
        // Suppression optimiste, annulée si l'API refuse.
        const snapshot = resource.data;
        setData((prev) => prev?.filter((w) => w.id !== id) ?? prev);
        try {
            await deleteWorkspace(id);
            toast.success("Espace de travail supprimé");
        } catch (e) {
            setData(snapshot);
            toast.error(errorMessage(e, "Impossible de supprimer l'espace de travail."));
        }
    };

    return { ...resource, workspaces: resource.data ?? [], addWorkspace, removeWorkspace };
};
