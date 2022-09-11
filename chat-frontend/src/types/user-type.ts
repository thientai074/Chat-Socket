export type UserInfor = {
    _id: string;
    email: string;
    avatar: string;
    isAdmin: boolean;
    username: string;
    password: string;
    createdAt: Date;
    lastActive: Date;
};

export type User = {
    accessToken: string;
    userInfor: UserInfor;
};

export type AlphabetUser = {
    alphabet: string;
    user: UserInfor[];
}

export type FindActiveUser = {
    activeUserArray: string[]
}

export type ActiveSocketUser = {
    userId: string;
    socketId: string;
}
