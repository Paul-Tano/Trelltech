export type Member = {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
    email?: string;
    bio?: string;
};
export type Memberships = {
    id: string;
    idMember: string;
    memberType: string;
    unconfirmed: boolean;
    deactivated: boolean;
};
export type Workspace = {
    id: string;
    displayName: string;
    desc?: string;
    memberships: Memberships[]
}
export type CreateWorkspaceInput = {
    displayName: string;
    desc?: string;
}
export type Board = {
    id: string;
    name: string;
    desc?: string;
    idOrganization: string;
    closed: boolean;
    url?: string;
};

export type List = {
    id: string;
    name: string;
    idBoard: string;
    closed: boolean;
    pos?: number;
};

export type Card = {
    id: string;
    name: string;
    desc?: string;
    idList: string;
    idBoard: string;
    idMembers: string[];
    closed: boolean;
    pos?: number;
    due?: string | null;
    url?: string;
};

export type CreateBoardInput = {
    name: string;
    idOrganization: string;
    desc?: string;
    defaultLists?: boolean;
    prefs_backgroundColor?: string;
};

export type UpdateBoardInput = {
    name?: string;
    desc?: string;
    prefs_backgroundColor?: string;
};

export type CreateListInput = {
    name: string;
    idBoard: string;
};

export type UpdateListInput = {
    name: string;
};

export type CreateCardInput = {
    name: string;
    idList: string;
    desc?: string;
};

export type UpdateCardInput = {
    name?: string;
    desc?: string;
    idList?: string;
    due?: string | null;
};
