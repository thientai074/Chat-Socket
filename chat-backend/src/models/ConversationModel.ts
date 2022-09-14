import {Document, Schema} from "mongoose";
import mongoose from "mongoose";

interface ConversationType extends Document {
    members: string[] | undefined;
    isBlock: boolean;
    whoBlock: string
}

const ConversationSchema = new Schema<ConversationType>(
    {
        members: {type: Array},
        isBlock: {type: Boolean, default: false},
        whoBlock: {type: String}
    },
    {timestamps: true}
);

export const Conversation = mongoose.model<ConversationType>(
    "conversations",
    ConversationSchema
);
