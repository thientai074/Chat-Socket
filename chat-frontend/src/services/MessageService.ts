import {apiClient} from "../http-common";
import {Message} from "../types/message-type";

class MessageService {
    findAll(data: Message) {
        return apiClient.post("/message/find-all", data);
    }

    save(data: any) {
        return apiClient.post("/message/save", data);
    }

    markRead(data: Message) {
        return apiClient.post("/message/mark-read", data);
    }

    delete(data: Message) {
        return apiClient.post("/message/delete", data);
    }

    downloadFile(data: Message) {
        return apiClient.post("/message/download-file", data)
    }

    deleteAll(data: Message) {
        return apiClient.post("/message/delete-all", data);
    }
}

export default new MessageService();
