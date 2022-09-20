<template>
  <ZoomImage v-if="conversationStore.inZoomPicture" />
  <div class="intro-y chat grid grid-cols-12 gap-5 mt-5">
    <ChatSideMenu :socket="socket" />
    <div class="intro-y col-span-12 lg:col-span-8 2xl:col-span-9">
      <div class="chat__box box my-auto">
        <ChatDefault />
        <LoadingScreen v-if="conversationStore.isLoading" class="py-auto" />
        <ChatActive :socket="socket" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ChatDefault from "../../components/ChatDefault.vue";
import ChatActive from "../../components/ChatActive.vue";
import ChatSideMenu from "../../components/ChatSideMenu.vue";
import TopBar from "../../components/TopBar.vue";
import io from "socket.io-client";
import SideMenu from "../../components/SideMenu.vue";
import { onMounted, watch } from "vue";
import { useConversationStore } from "../../stores/conversation-store";
import { env } from "../../utils/MyVariables";
import ZoomImage from "../../components/ZoomImage.vue";
import LoadingScreen from "../../components/LoadingScreen.vue";

export default {
  name: "Home",
  components: {
    ChatDefault,
    ChatActive,
    ChatSideMenu,
    TopBar,
    SideMenu,
    ZoomImage,
    LoadingScreen,
  },
  setup() {
    // @ts-ignore
    const socket = io.connect(env.hostSocket);
    const conversationStore = useConversationStore();

    watch(
      () => conversationStore.inZoomPicture,
      (value: boolean) => {
        if (value == true) {
          window.onscroll = () => {
            window.scroll(0, 100);
          };
        } else {
          // @ts-ignore
          window.onscroll = "";
        }
      }
    );

    return { socket, conversationStore };
  },
};
</script>

<style></style>
