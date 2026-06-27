import api from "./api";
import { Card, CreateCardInput, UpdateCardInput } from "../types";

export const getCardsByList = async (listId: string): Promise<Card[]> => {
    const response = await api.get(`/lists/${listId}/cards`);
    return response.data;
};

export const getCardById = async (id: string): Promise<Card> => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
};

export const createCard = async (input: CreateCardInput): Promise<Card> => {
    const response = await api.post("/cards", {
        name: input.name,
        idList: input.idList,
        desc: input.desc ?? "",
    });
    return response.data;
};

export const updateCard = async (
    id: string,
    input: UpdateCardInput
): Promise<Card> => {
    const response = await api.put(`/cards/${id}`, input);
    return response.data;
};

export const deleteCard = async (id: string): Promise<void> => {
    await api.delete(`/cards/${id}`);
};

export const addMemberToCard = async (
    cardId: string,
    memberId: string
): Promise<void> => {
    await api.post(`/cards/${cardId}/idMembers`, {
        value: memberId,
    });
};

// Retirer un membre d'une carte
export const removeMemberFromCard = async (
    cardId: string,
    memberId: string
): Promise<void> => {
    await api.delete(`/cards/${cardId}/idMembers/${memberId}`);
};