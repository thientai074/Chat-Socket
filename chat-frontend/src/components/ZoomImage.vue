<template>
  <div class="flex z-50 w-screen bg-[#2b2b2b] image-zoom">
    <img
        @click="conversationStore.getZoomImage(message.file.data)"
        alt="picture"
        width="760"
        class="mx-auto py-28"
        v-bind:src="`data:image/jpeg;base64,${conversationStore.imageLink}`"
    />
    <p
        @click="conversationStore.closeImage()"
        class="text-white text-2xl pt-12 pr-24 cursor-pointer"
    >
      X
    </p>
  </div>
</template>

<script lang="ts">
import {useConversationStore} from "../stores/conversation-store";

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

<style>
.image-zoom {
  height: 100vh !important;
}
</style>
