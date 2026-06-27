import { Board, CreateBoardInput, UpdateBoardInput } from "../types";
import { getBoardsByWorkspace, createBoard, deleteBoard, updateBoard } from "../services/boardService";
import { useEffect, useState } from "react";

export const useBoards = (workspaceId: string) => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBoard = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBoardsByWorkspace(workspaceId);
            setBoards(data);
        } catch {
            setError("Impossible de récupérer les Boards");
        } finally {
            setLoading(false);
        }
    };

    const addBoard = async (input: CreateBoardInput) => {
        setLoading(true);
        setError(null);
        try {
            const newBoard = await createBoard(input);
            setBoards((prev) => [...prev, newBoard]);
        } catch (err: any) {
            setError("Impossible de créer le Board");
        
        } finally {
            setLoading(false);
        }
    };

    const editBoard = async (id: string, input: UpdateBoardInput) => {
        setLoading(true);
        setError(null);
        try {
            const updatedBoard = await updateBoard(id, input);
            setBoards((prev) => prev.map((b) => (b.id === id ? updatedBoard : b)));
        } catch (err: any) {
            setError("Impossible de modifier le board");
        } finally {
            setLoading(false);
        }
    };

    const removeBoard = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteBoard(id);
            setBoards((prev) => prev.filter((b) => b.id !== id));
        } catch {
            setError("Impossible de supprimer le board");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoard();
    }, []);

    return { boards, loading, error, fetchBoard, addBoard, removeBoard, editBoard };
};