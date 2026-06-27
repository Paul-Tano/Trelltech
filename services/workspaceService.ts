import api from "./api";
import { Workspace, CreateWorkspaceInput } from "../types";

export const getWorkspaces = async (): Promise<Workspace[]> => {
    const response = await api.get("/members/me/organizations");
    return response.data;
};

export const getWorkspaceById = async (id: string): Promise<Workspace> => {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
};

export const createWorkspace = async ( input: CreateWorkspaceInput
): Promise<Workspace> => {
    const response = await api.post("/organizations", {
        displayName: input.displayName,
        desc: input.desc ?? "",
    });
    return response.data;
};

export const deleteWorkspace = async (id: string): Promise<void> => {
    await api.delete(`/organizations/${id}`);
};