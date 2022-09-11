import express from "express"
import {conversationRoute} from "./ConversationRoute"
import {messageRoute} from "./MessageRoute"
import {userRoute} from "./UserRoute"

export const useRoute = function (app: express.Application) {
    userRoute(app)
    conversationRoute(app)
    messageRoute(app)
}