export type Member = {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string | null;
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
    memberships?: Memberships[];
};

export type CreateWorkspaceInput = {
    displayName: string;
    desc?: string;
};

export type BoardPrefs = {
    backgroundColor?: string | null;
    backgroundTopColor?: string | null;
};

export type Board = {
    id: string;
    name: string;
    desc?: string;
    idOrganization: string;
    closed: boolean;
    url?: string;
    prefs?: BoardPrefs;
};

export type Label = {
    id: string;
    name: string;
    color: string | null;
};

export type CardBadges = {
    description?: boolean;
    comments?: number;
    attachments?: number;
    checkItems?: number;
    checkItemsChecked?: number;
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
    dueComplete?: boolean;
    labels?: Label[];
    badges?: CardBadges;
    url?: string;
};

export type List = {
    id: string;
    name: string;
    idBoard: string;
    closed: boolean;
    pos?: number;
};

/** Liste accompagnée de ses cartes (chargées en une seule requête). */
export type ListWithCards = List & { cards: Card[] };

export type CreateBoardInput = {
    name: string;
    idOrganization: string;
    desc?: string;
};

export type UpdateBoardInput = {
    name?: string;
    desc?: string;
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
    dueComplete?: boolean;
    pos?: "top" | "bottom" | number;
};
