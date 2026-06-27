import AsyncStorage from "@react-native-async-storage/async-storage";
import { Board, CreateBoardInput, UpdateBoardInput } from "../types";

const BASE_URL = "https://api.trello.com/1";

const getCredentials = async () => {
    const key = await AsyncStorage.getItem("trello_key");
    const token = await AsyncStorage.getItem("trello_token");
    return { key, token };
};

export const getBoardsByWorkspace = async (workspaceId: string): Promise<Board[]> => {
    const { key, token } = await getCredentials();
    const res = await fetch(`${BASE_URL}/organizations/${workspaceId}/boards?filter=open&key=${key}&token=${token}`);
    return res.json();
};

export const getBoardById = async (id: string): Promise<Board> => {
    const { key, token } = await getCredentials();
    const res = await fetch(`${BASE_URL}/boards/${id}?key=${key}&token=${token}`);
    return res.json();
};

export const createBoard = async (input: CreateBoardInput): Promise<Board> => {
    const { key, token } = await getCredentials();
    const url = `${BASE_URL}/boards?key=${key}&token=${token}&name=${encodeURIComponent(input.name)}&idOrganization=${input.idOrganization}&defaultLists=false&desc=${encodeURIComponent(input.desc ?? "")}`;
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
        const err = await res.text();
        console.error("createBoard error:", err);
        throw new Error(err);
    }
    return res.json();
};

export const updateBoard = async (id: string, input: UpdateBoardInput): Promise<Board> => {
    const { key, token } = await getCredentials();
    const params = new URLSearchParams({ key: key!, token: token! });
    if (input.name) params.append("name", input.name);
    if (input.desc) params.append("desc", input.desc);
    const res = await fetch(`${BASE_URL}/boards/${id}?${params.toString()}`, { method: "PUT" });
    if (!res.ok) {
        const err = await res.text();
        console.error("updateBoard error:", err);
        throw new Error(err);
    }
    return res.json();
};

export const deleteBoard = async (id: string): Promise<void> => {
    const { key, token } = await getCredentials();
    await fetch(`${BASE_URL}/boards/${id}?key=${key}&token=${token}`, { method: "DELETE" });
};