export interface IConversation {
    members: string[] | undefined;
    _id: string;
    isBlock: boolean;
    whoBlock: string
}

export interface ISearchConversation {
    username: string
}