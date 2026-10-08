import api from "./api";
import { Member } from "../types";

const MEMBER_FIELDS = "username,fullName,avatarUrl,email";

export const getMe = async (): Promise<Member> => {
    const response = await api.get("/members/me", { params: { fields: MEMBER_FIELDS } });
    return response.data;
};

/** Membres d'un board : les seuls qu'il est possible d'assigner à ses cartes. */
export const getMembersByBoard = async (boardId: string): Promise<Member[]> => {
    const response = await api.get(`/boards/${boardId}/members`, {
        params: { fields: "username,fullName,avatarUrl" },
    });
    return response.data;
};
