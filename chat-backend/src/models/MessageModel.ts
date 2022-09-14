import {Document, Schema} from "mongoose";
import mongoose from "mongoose";

interface MessageType extends Document {
    conversationId: string;
    sender: string;
    text: string;
    receiver: string;
    read: boolean;
    isImage: boolean;
    isFile: boolean;
    fileSize: string;
    file: any;
    fileName: string;
    dayCreated: string;
    timeCreated: string;
    youtubeThumbnail: string;
}

const MessageSchema = new Schema<MessageType>(
    {
        conversationId: {type: String},
        sender: {type: String},
        text: {type: String},
        receiver: {type: String},
        read: {type: Boolean, default: false},
        isImage: {type: Boolean},
        isFile: {type: Boolean},
        file: {data: Buffer, contentType: String},
        fileSize: {type: String},
        fileName: {type: String},
        dayCreated: {type: String},
        timeCreated: {type: String},
        youtubeThumbnail: {type: String}
    },
    {timestamps: true}
);

export const Message = mongoose.model<MessageType>("messages", MessageSchema);
