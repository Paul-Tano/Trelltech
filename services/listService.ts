import api from "./api";
import { List, CreateListInput, UpdateListInput } from "../types";

export const getListsByBoard = async (boardId: string): Promise<List[]> => {
    const response = await api.get(`/boards/${boardId}/lists`, {
        params: { filter: "open" },
    });
    return response.data;
};

export const createList = async (input: CreateListInput): Promise<List> => {
    const response = await api.post("/lists", {
        name: input.name,
        idBoard: input.idBoard,
    });
    return response.data;
};

export const updateList = async (
    id: string,
    input: UpdateListInput
): Promise<List> => {
    const response = await api.put(`/lists/${id}`, {
        name: input.name,
    });
    return response.data;
};

export const archiveList = async (id: string): Promise<void> => {
    await api.put(`/lists/${id}/closed`, { value: true });
};