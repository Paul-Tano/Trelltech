import api from "./api";
import { Label } from "../types";

export const getBoardLabels = async (boardId: string): Promise<Label[]> => {
    const response = await api.get(`/boards/${boardId}/labels`, { params: { fields: "name,color", limit: 100 } });
    return response.data;
};

export const createLabel = async (idBoard: string, name: string, color: string): Promise<Label> => {
    const response = await api.post("/labels", { idBoard, name, color });
    return response.data;
};

export const addLabelToCard = async (cardId: string, labelId: string): Promise<void> => {
    await api.post(`/cards/${cardId}/idLabels`, { value: labelId });
};

export const removeLabelFromCard = async (cardId: string, labelId: string): Promise<void> => {
    await api.delete(`/cards/${cardId}/idLabels/${labelId}`);
};
