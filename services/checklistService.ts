import api from "./api";
import { CheckItem, Checklist } from "../types";

export const getChecklists = async (cardId: string): Promise<Checklist[]> => {
    const response = await api.get(`/cards/${cardId}/checklists`, {
        params: { checkItems: "all", checkItem_fields: "name,state,pos" },
    });
    return response.data;
};

export const createChecklist = async (cardId: string, name: string): Promise<Checklist> => {
    const response = await api.post(`/cards/${cardId}/checklists`, { name, pos: "bottom" });
    return { checkItems: [], ...response.data };
};

export const deleteChecklist = async (checklistId: string): Promise<void> => {
    await api.delete(`/checklists/${checklistId}`);
};

export const addCheckItem = async (checklistId: string, name: string): Promise<CheckItem> => {
    const response = await api.post(`/checklists/${checklistId}/checkItems`, { name, pos: "bottom" });
    return response.data;
};

export const setCheckItemState = async (cardId: string, checkItemId: string, complete: boolean): Promise<void> => {
    await api.put(`/cards/${cardId}/checkItem/${checkItemId}`, { state: complete ? "complete" : "incomplete" });
};

export const deleteCheckItem = async (checklistId: string, checkItemId: string): Promise<void> => {
    await api.delete(`/checklists/${checklistId}/checkItems/${checkItemId}`);
};
