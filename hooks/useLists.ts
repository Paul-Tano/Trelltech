import { useState, useEffect } from "react";
import { List, CreateListInput, UpdateListInput } from "@/types";
import { getListsByBoard, createList, updateList, archiveList } from "../services/listService";

export const useLists = (boardId: string) => {
    const [lists, setLists] = useState<List[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchList = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getListsByBoard(boardId);
            setLists(data);
        } catch {
            setError("Impossible de récupérer les listes");
        } finally {
            setLoading(false);
        }
    };

    const addList = async (input: CreateListInput) => {
        setLoading(true);
        setError(null);
        try {
            const newList = await createList(input);
            setLists((prev) => [...prev, newList]);
        } catch {
            setError("Impossible de créer la liste");
        } finally {
            setLoading(false);
        }
    };

    const removeList = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await archiveList(id);
            setLists((prev) => prev.filter((l) => l.id !== id));
        } catch {
            setError("Impossible d'archiver la liste");
        } finally {
            setLoading(false);
        }
    };

    const editList = async (id: string, input: UpdateListInput) => {
        setLoading(true);
        setError(null);
        try {
            const updatedList = await updateList(id, input);
            setLists((prev) => prev.map((l) => (l.id === id ? updatedList : l)));
        } catch {
            setError("Impossible de mettre à jour la liste");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchList();
    }, [boardId]);

    return { lists, loading, error, fetchList, addList, removeList, editList };
};