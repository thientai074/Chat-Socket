<template>
  <div class="w-full h-screen bg-[#2b2b2b]">
    <div class="flex z-50">
      <img
        @click="conversationStore.getZoomImage(message.file.data)"
        alt="picture"
        width="760"
        class="mx-auto py-28 "
        v-bind:src="`data:image/jpeg;base64,${conversationStore.imageLink}`"
      />
      <p
        @click="conversationStore.closeImage()"
        class="text-white text-2xl pt-12 pr-12 cursor-pointer"
      >
        X
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { useConversationStore } from "../stores/conversation-store";

export default {
  name: "ZoomImage",
  setup() {
    const conversationStore = useConversationStore();
    return {
      conversationStore,
    };
  },
};
</script>

<style></style>
