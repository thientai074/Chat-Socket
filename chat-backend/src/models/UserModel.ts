import {Document, Schema} from "mongoose";
import mongoose from "mongoose";

interface UserType extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    avatar: string;
    lastActive: Date
}

const UserSchema = new Schema<UserType>(
    {
        username: {type: String, minLength: 5, required: true, unique: true},
        email: {
            type: String,
            minLength: 5,
            unique: true,
            required: true,
            validate: {
                validator: function (v: any) {
                    // Valid email belike hung@gmail.com
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email",
            },
        },
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
        avatar: {type: String, required: true},
        lastActive: {type: Date, default: Date.now}
    },
    {timestamps: true}
);

export const User = mongoose.model<UserType>("users", UserSchema);
