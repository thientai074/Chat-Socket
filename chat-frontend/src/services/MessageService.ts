import {apiClient} from "../http-common";
import {Message} from "../types/message-type";

class MessageService {
    findAll(data: Message, token: string) {
        return apiClient(token).post("/message/find-all", data);
    }

    save(data: any, token: string) {
        return apiClient(token).post("/message/save", data);
    }

    markRead(data: Message, token: string) {
        return apiClient(token).post("/message/mark-read", data);
    }

    delete(data: Message, token: string) {
        return apiClient(token).post("/message/delete", data);
    }

    downloadFile(data: Message, token: string) {
        return apiClient(token).post("/message/download-file", data)
    }

    deleteAll(data: Message, token: string) {
        return apiClient(token).post("/message/delete-all", data);
    }
}

export default new MessageService();
