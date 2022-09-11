export interface IUser {
    _id: string;
    username: string;
    password: string;
    isAdmin: boolean;
    avatar: string;
    email: string;
    lastActive: Date;
}

export interface IFindActiveUser {
    activeUserArray: string[]
}