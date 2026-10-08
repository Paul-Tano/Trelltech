import api from "./api";
import { Board, CreateBoardInput, UpdateBoardInput } from "../types";

const BOARD_FIELDS = "name,desc,idOrganization,closed,url,prefs";

export const getBoardsByWorkspace = async (workspaceId: string): Promise<Board[]> => {
    const response = await api.get(`/organizations/${workspaceId}/boards`, {
        params: { filter: "open", fields: BOARD_FIELDS },
    });
    return response.data;
};

export const getBoardById = async (id: string): Promise<Board> => {
    const response = await api.get(`/boards/${id}`, { params: { fields: BOARD_FIELDS } });
    return response.data;
};

export const createBoard = async (input: CreateBoardInput): Promise<Board> => {
    const response = await api.post("/boards", null, {
        params: {
            name: input.name,
            idOrganization: input.idOrganization,
            desc: input.desc ?? "",
            defaultLists: false,
        },
    });
    return response.data;
};

export const updateBoard = async (id: string, input: UpdateBoardInput): Promise<Board> => {
    // `desc` peut valoir "" pour effacer la description.
    const response = await api.put(`/boards/${id}`, null, { params: input });
    return response.data;
};

export const deleteBoard = async (id: string): Promise<void> => {
    await api.delete(`/boards/${id}`);
};
