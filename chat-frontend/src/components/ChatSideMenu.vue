<template>
  <TabGroup class="col-span-12 lg:col-span-4 2xl:col-span-3">
    <div class="intro-y pr-1">
      <div class="box p-2">
        <TabList class="nav-pills">
          <Tab class="w-full py-2" tag="button">Chats</Tab>
          <Tab class="w-full py-2" tag="button">Friends</Tab>
          <Tab class="w-full py-2" tag="button">Profile</Tab>
        </TabList>
      </div>
    </div>
    <TabPanels>
      <TabPanel>
        <div class="pr-1">
          <div class="box px-5 pt-5 pb-5 lg:pb-0 mt-5">
            <div class="relative text-slate-500">
              <input
                  type="text"
                  class="form-control py-3 px-4 border-transparent bg-slate-100 pr-10"
                  placeholder="Search for users..."
                  v-model="usernameKeyword"
                  v-on:keyup="findListConversation"
              />
              <SearchIcon
                  class="w-4 h-4 hidden sm:absolute my-auto inset-y-0 mr-3 right-0"
              />
            </div>
            <div class="overflow-x-auto scrollbar-hidden">
              <div class="flex mt-5">
                <ActiveUser
                    v-for="activeUser in activeUsers"
                    :key="activeUser._id"
                    :activeUser="activeUser"
                />
              </div>
            </div>
          </div>
        </div>
        <div
            id="conversation-list"
            class="chat__chat-list overflow-y-auto scrollbar-hidden pr-1 pt-1 mt-4"
        >
          <Conversation
              :socket="socket"
              v-for="conversation in conversations"
              :key="conversation._id"
              :conversation="conversation"
          />
        </div>
      </TabPanel>
      <FriendList/>
      <ChatProfile/>
    </TabPanels>
  </TabGroup>
</template>

<script lang="ts">
import ChatProfile from "./ChatProfile.vue";
import Conversation from "./Conversation.vue";
import ActiveUser from "./ActiveUser.vue";
import FriendList from "./FriendList.vue";
import {onMounted, computed, ref} from "vue";
import {useConversationStore} from "../stores/conversation-store";
import {useAuthStore} from "../stores/auth-store";
import UserService from "../services/UserService";
import {
  setNotificationFailedWhenGetData,
  setNotificationToastMessage,
} from "../utils/MyFunction";
import {
  ActiveSocketUser,
  FindActiveUser,
  UserInfor,
} from "../types/user-type";
import ConversationService from "../services/ConversationService";
import {FindListConversation} from "../types/conversation-type";

export default {
  name: "ChatSideMenu",
  components: {ChatProfile, FriendList, ActiveUser, Conversation},
  props: ["socket"],
  setup(props) {
    const activeUsers = ref<UserInfor[]>([]);
    const usernameKeyword = ref("");
    const activeUserArray: any = ref([]);

    const conversationStore = useConversationStore();
    const authStore = useAuthStore();

    const activeUserId = authStore.currentUser.userInfor._id;

    async function actionFindUserActive() {
      if (activeUserArray) {
        const data = {
          activeUserArray: activeUserArray.value,
        } as FindActiveUser;
        const response = await UserService.findActiveUser(data);
        if (response.data) {
          if (response.data.success) {
            activeUsers.value = response.data.values;
          } else {
            setNotificationToastMessage(response.data.message, false);
          }
        } else {
          setNotificationFailedWhenGetData();
        }
      }
    }

    async function findListConversation() {
      const data = {
        username: usernameKeyword.value,
      } as FindListConversation;

      const response = await ConversationService.findList(data);
      if (response.data) {
        if (response.data.success) {
          conversationStore.getListConversations(response.data.values);
        } else if (!response.data.success) {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    onMounted(() => {
      findListConversation();
    });

    props.socket.emit("add_active_user", activeUserId);
    props.socket.on("get_active_user", (data: ActiveSocketUser[]) => {
      data.map((user: ActiveSocketUser) => {
        activeUserArray.value.push(user.userId);
      });
      actionFindUserActive();
    });

    props.socket.on("filter_disconnect_user", (data: ActiveSocketUser[]) => {
      activeUserArray.value = [];
      data.map((user: ActiveSocketUser) => {
        activeUserArray.value.push(user.userId);
      });
      actionFindUserActive();
    });

    props.socket.on("get_new_conversation_change", async (data: any) => {
      // Khi có tin nhắn mới Scrool to top of div
      const element: HTMLElement | any = await document.getElementById(
          "conversation-list"
      );
      element.scrollTop = 0;

      findListConversation();
    });

    const conversations = computed(() => {
      return conversationStore.conversations;
    });

    return {
      activeUsers,
      conversations,
      usernameKeyword,
      findListConversation,
    };
  },
};
</script>
