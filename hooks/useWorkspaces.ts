import { useState, useEffect } from "react";
import { Workspace, CreateWorkspaceInput } from "../types";
import {getWorkspaces, createWorkspace, deleteWorkspace} from "../services/workspaceService";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const useWorkspaces = () => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const clearStorage = async () => {
        await AsyncStorage.removeItem("trello_token");
        await AsyncStorage.removeItem("trello_key");
        router.replace("/onboarding/token");
      };
    const fetchWorkspaces = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWorkspaces();
            setWorkspaces(data);
        } catch {
            setError("Impossible de récupérer les workspaces");
        } finally {
            setLoading(false);
        }
    };

    const addWorkspace = async (input: CreateWorkspaceInput) => {
        setLoading(true);
        setError(null);
        try {
            const newWorkspace = await createWorkspace(input);
            setWorkspaces((prev) => [...prev, newWorkspace]);
        } catch {
            setError("Impossible de créer le workspace");
        } finally {
            setLoading(false);
        }
    };

    const removeWorkspace = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteWorkspace(id);
            setWorkspaces((prev) => prev.filter((w) => w.id !== id));
        } catch {
            setError("Impossible de supprimer le workspace");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    return { workspaces, loading, error, fetchWorkspaces, addWorkspace, removeWorkspace, clearStorage };
};