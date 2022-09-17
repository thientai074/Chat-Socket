import {apiClient} from "../http-common";
import {ConversationData, FindListConversation, Conversation} from "../types/conversation-type";

class ConversationService {
    findList(data: FindListConversation, token: string) {
        return apiClient(token).post("/conversation/find-list", data);
    }

    save(data: ConversationData, token: string) {
        return apiClient(token).post("/conversation/save", data);
    }

    delete(data: Conversation, token: string) {
        return apiClient(token).post("/conversation/delete", data);
    }

    block(data: Conversation, token: string) {
        return apiClient(token).post("/conversation/block", data);
    }

    unblock(data: Conversation, token: string) {
        return apiClient(token).post("/conversation/unblock", data);
    }
}

export default new ConversationService();
