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

export type UpdateWorkspaceInput = {
    displayName?: string;
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
    starred?: boolean;
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
    background?: BoardBackground;
    /** Copie la structure (listes, étiquettes) d'un board existant. */
    idBoardSource?: string;
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

export type CheckItem = {
    id: string;
    name: string;
    state: "complete" | "incomplete";
    pos?: number;
};

export type Checklist = {
    id: string;
    name: string;
    idCard: string;
    checkItems: CheckItem[];
};

/** Action Trello de type "commentCard". */
export type Comment = {
    id: string;
    date: string;
    data: { text: string };
    memberCreator: Pick<Member, "id" | "fullName" | "username" | "avatarUrl">;
};

export type BoardStar = {
    id: string;
    idBoard: string;
    pos: number;
};

/** Couleurs de fond proposées par Trello à la création d'un board. */
export type BoardBackground = "blue" | "orange" | "green" | "red" | "purple" | "pink" | "lime" | "sky" | "grey";
