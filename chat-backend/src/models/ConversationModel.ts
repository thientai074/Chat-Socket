import {Document, Schema} from "mongoose";
import mongoose from "mongoose";

interface ConversationType extends Document {
    members: string[] | undefined;
}

const ConversationSchema = new Schema<ConversationType>(
    {
        members: {type: Array},
    },
    {timestamps: true}
);

export const Conversation = mongoose.model<ConversationType>(
    "conversations",
    ConversationSchema
);
