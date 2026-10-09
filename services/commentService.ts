import api from "./api";
import { Comment } from "../types";

/** Commentaires d'une carte, du plus récent au plus ancien. */
export const getComments = async (cardId: string): Promise<Comment[]> => {
    const response = await api.get(`/cards/${cardId}/actions`, {
        params: { filter: "commentCard", limit: 50, memberCreator_fields: "fullName,username,avatarUrl" },
    });
    return response.data;
};

export const addComment = async (cardId: string, text: string): Promise<Comment> => {
    const response = await api.post(`/cards/${cardId}/actions/comments`, { text });
    return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
    await api.delete(`/actions/${commentId}`);
};
