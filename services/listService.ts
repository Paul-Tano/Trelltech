import api from "./api";
import { List, ListWithCards, CreateListInput, UpdateListInput } from "../types";

const CARD_FIELDS = "name,desc,idList,idBoard,idMembers,closed,pos,due,dueComplete,labels,badges";

/** Listes ouvertes d'un board avec leurs cartes, en une seule requête. */
export const getListsWithCards = async (boardId: string): Promise<ListWithCards[]> => {
    const response = await api.get(`/boards/${boardId}/lists`, {
        params: { filter: "open", cards: "open", card_fields: CARD_FIELDS },
    });
    return response.data;
};

export const getListsByBoard = async (boardId: string): Promise<List[]> => {
    const response = await api.get(`/boards/${boardId}/lists`, {
        params: { filter: "open", fields: "name,idBoard,closed,pos" },
    });
    return response.data;
};

export const createList = async (input: CreateListInput): Promise<List> => {
    const response = await api.post("/lists", {
        name: input.name,
        idBoard: input.idBoard,
        pos: "bottom",
    });
    return response.data;
};

export const updateList = async (id: string, input: UpdateListInput): Promise<List> => {
    const response = await api.put(`/lists/${id}`, { name: input.name });
    return response.data;
};

export const archiveList = async (id: string): Promise<void> => {
    await api.put(`/lists/${id}/closed`, { value: true });
};
