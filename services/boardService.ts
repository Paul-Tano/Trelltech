import api from "./api";
import { Board, BoardStar, CreateBoardInput, UpdateBoardInput } from "../types";

const BOARD_FIELDS = "name,desc,idOrganization,closed,url,prefs,starred";

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
            ...(input.background ? { prefs_background: input.background } : {}),
            // Copie les listes et étiquettes du board source, sans ses cartes.
            ...(input.idBoardSource ? { idBoardSource: input.idBoardSource, keepFromSource: "none" } : {}),
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

/** Tous les boards ouverts de l'utilisateur (tous workspaces confondus). */
export const getMyBoards = async (): Promise<Board[]> => {
    const response = await api.get("/members/me/boards", { params: { filter: "open", fields: BOARD_FIELDS } });
    return response.data;
};

export const starBoard = async (idBoard: string): Promise<void> => {
    await api.post("/members/me/boardStars", { idBoard, pos: "top" });
};

export const unstarBoard = async (idBoard: string): Promise<void> => {
    // L'API supprime une étoile par son id, pas par l'id du board.
    const { data } = await api.get<BoardStar[]>("/members/me/boardStars");
    const star = data.find((s) => s.idBoard === idBoard);
    if (star) await api.delete(`/members/me/boardStars/${star.id}`);
};
