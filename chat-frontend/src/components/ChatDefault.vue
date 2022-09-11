<template>
  <div v-if="!conversationStore.inChatting" class="h-full flex items-center">
    <div class="mx-auto text-center">
      <div
          class="w-16 h-16 flex-none image-fit rounded-full overflow-hidden mx-auto"
      >
        <img
            alt="Midone Tailwind HTML Admin Template"
            v-bind:src="currentUser?.avatar"
        />
      </div>
      <div class="mt-3">
        <div class="font-medium">Hey, {{ currentUser.username }}!</div>
        <div class="text-slate-500 mt-1">
          Please select a chat to start messaging.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed} from "vue";
import {useConversationStore} from "../stores/conversation-store";
import {useAuthStore} from "../stores/auth-store";

export default {
  name: "ChatDefault",
  setup() {

    const conversationStore = useConversationStore();
    const authStore = useAuthStore();

    const currentUser = computed(() => {
      return authStore.currentUser.userInfor;
    });

    return {

      conversationStore,
      currentUser,
    };
  },
};
</script>
