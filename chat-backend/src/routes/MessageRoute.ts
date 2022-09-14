import express from "express";
import {
    saveMessage,
    findAllMessages,
    markReadMessage,
    deleteMessage,
    downloadFile,
    deleteAllMessageInConversation
} from "../controlllers/MessageController";

export const messageRoute = function (app: express.Application) {
    app.route("/api/message/save").post(saveMessage);
    app.route("/api/message/find-all").post(findAllMessages);
    app.route("/api/message/mark-read").post(markReadMessage);
    app.route("/api/message/delete-all").post(deleteAllMessageInConversation);
    app.route("/api/message/delete").post(deleteMessage);
    app.route("/api/message/download-file").post(downloadFile)
};