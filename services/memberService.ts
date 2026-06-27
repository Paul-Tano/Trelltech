import api from "./api";
import { Member } from "../types";

export const getMe = async (): Promise<Member> => {
    const response = await api.get("/members/me");
    return response.data;
};

export const getMembersByBoard = async (boardId: string): Promise<Member[]> => {
    const response = await api.get(`/boards/${boardId}/members`);
    return response.data;
};

export const getMemberByUsername = async (username: string): Promise<Member> => {
    const response = await api.get(`/members/${username}`);
    return response.data;
};

export const searchMembers = async (query: string): Promise<Member[]> => {
    const response = await api.get("/search/members", {
        params: { query, limit: 8 },
    });
    return response.data;
};