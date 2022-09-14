<template>
  <div
      @click="actionAddNewConversation(stranger._id)"
      class="cursor-pointer box relative flex items-center p-5 mt-5 hover:bg-slate-400"
  >
    <div class="w-12 h-12 flex-none image-fit mr-1">
      <img
          alt="Midone Tailwind HTML Admin Template"
          class="rounded-full"
          v-bind:src="stranger.avatar"
      />
      <div
          class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white dark:border-darkmode-600"
      ></div>
    </div>
    <div class="ml-2 overflow-hidden">
      <div class="flex items-center">
        <a class="font-medium">{{ stranger.username }}</a>
      </div>
      <div class="w-full truncate text-slate-500 mt-0.5">
        Click to add new friend
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  setNotificationFailedWhenGetData,
  setNotificationToastMessage,
} from "../utils/MyFunction";
import {useRouter} from "vue-router";
import {ConversationData} from '../types/conversation-type';
import ConversationService from '../services/ConversationService';

export default {
  name: "SingleStranger",
  props: ["stranger"],
  setup() {
    const router = useRouter();

    async function actionAddNewConversation(userId: string) {
      const data = {
        receiverId: userId,
      } as ConversationData;
      if (data) {
        const response = await ConversationService.save(data);
        if (response.data) {
          if (!response.data.success) {
            setNotificationToastMessage(response.data.message, false);
          }
        } else {
          setNotificationFailedWhenGetData();
        }
      }
      router.go(0);
    }

    return {
      actionAddNewConversation,
    };
  },
};
</script>

<style></style>
