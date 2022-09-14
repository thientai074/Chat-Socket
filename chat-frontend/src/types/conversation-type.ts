import {Message} from "./message-type";
import {UserInfor} from "./user-type";

export type Conversation = {
    lastMessage: Message;
    unreadMessage: Message[];
    userDetails: UserInfor[];
    _id: string;
    isBlock: boolean;
    whoBlock: string
};

export type ConversationData = {
    receiverId: string;
}

export type FindListConversation = {
    username: string
}
