<template>
  <div
    @click="joinConversation(conversation._id)"
    class="intro-x cursor-pointer box relative flex items-center p-5 mt-5 hover:bg-slate-400"
  >
    <div class="w-12 h-12 flex-none image-fit mr-1">
      <img
        alt="Midone Tailwind HTML Admin Template"
        class="rounded-full"
        v-bind:src="conversation?.userDetails[0]?.avatar"
      />
      <div
        class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600"
      ></div>
    </div>
    <div class="ml-2 overflow-hidden">
      <div class="flex items-center">
        <a href="javascript:" class="font-medium">{{
          conversation?.userDetails[0]?.username
        }}</a>
        <div class="text-xs text-slate-400 ml-16">
          {{ moment(conversation?.lastMessage?.createdAt).format("HH:mm") }}
        </div>
        <Dropdown class="hidden sm:block ml-12 my-auto">
          <DropdownToggle
            tag="a"
            href="javascript:;"
            class="w-4 h-4 text-slate-500"
          >
            <MoreVerticalIcon class="w-4 h-4" />
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem @click="actionDeleteConversation(conversation)">
                <TrashIcon class="w-4 h-4 mr-2" /> Delete
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="w-full truncate text-slate-500 mt-0.5">
        {{ conversation?.lastMessage?.text }}
      </div>
    </div>
    <div
      v-if="
        conversation?.unreadMessage.length > 0 &&
        conversation?.lastMessage?.sender !==
          authStore.currentUser.userInfor._id
      "
      class="w-5 h-5 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-primary font-medium -mt-1 -mr-1"
    >
      {{ conversation?.unreadMessage.length }}
    </div>
  </div>
</template>

<script lang="ts">
import { useConversationStore } from "../stores/conversation-store";
import moment from "moment";
import { useAuthStore } from "../stores/auth-store";
import { Message } from "../types/message-type";
import MessageService from "../services/MessageService";
import {
  setNotificationFailedWhenGetData,
  setNotificationToastMessage,
} from "../utils/MyFunction";
import { Conversation } from "../types/conversation-type";
import ConversationService from "../services/ConversationService";
import UserService from "../services/UserService";
import { UserInfor } from "../types/user-type";

export default {
  name: "Conversation",
  props: ["conversation", "socket"],
  // @ts-ignore
  setup(props) {
    const conversationStore = useConversationStore();
    const authStore = useAuthStore();

    async function actionMarkReadMessage(conversationId: string) {
      const data = {
        conversationId: conversationId,
      } as Message;
      const response = await MessageService.markRead(data);

      if (response.data) {
        if (!response.data.success) {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    async function joinConversation(conversationId: string) {
      props.socket.emit("join_conversation", conversationId);
      conversationStore.openChat();
      // Lấy thông tin cuộc trò chuyện
      await conversationStore.getChatDetail(conversationId);

      // Change to read message
      if (
        authStore.currentUser.userInfor._id !==
        props.conversation?.lastMessage?.sender
      ) {
        await actionMarkReadMessage(conversationId);
      }

      // Scroll tới cuối cùng
      const element: HTMLElement | any = await document.getElementById(
        "message-box"
      );
      element.scrollTop = element.scrollHeight;
    }

    async function actionDeleteAllMessageInConversation(conversation) {
      const data = {
        conversationId: conversation._id,
      } as Message;

      const response = await MessageService.deleteAll(data);
      if (response.data) {
        if (!response.data.success) {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }   

    async function actionDeleteConversation(conversation) {
      const data = {
        _id: conversation._id,
      } as Conversation;

      const response = await ConversationService.delete(data);
      if (response.data) {
        if (response.data.success) {
          conversationStore.deleteConversation(conversation);
          actionDeleteAllMessageInConversation(conversation);
        } else {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    return {
      conversationStore,
      joinConversation,
      moment,
      authStore,
      actionDeleteConversation,
    };
  },
};
</script>

<style></style>
