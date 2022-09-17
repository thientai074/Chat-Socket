<template>
  <TabPanel>
    <div class="pr-1">
      <div class="box px-5 py-10 mt-5">
        <div
          class="w-20 h-20 flex-none image-fit rounded-full overflow-hidden mx-auto"
        >
          <img
            alt="Midone Tailwind HTML Admin Template"
            v-bind:src="currentUser?.avatar"
          />
        </div>
        <div class="text-center mt-3">
          <div class="font-medium text-lg">
            {{ currentUser?.username }}
          </div>
          <div class="text-slate-500 mt-1">Just a guy is falling in love</div>
        </div>
      </div>
      <div class="box p-5 mt-5">
        <div
          class="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 py-5"
        >
          <div>
            <div class="text-slate-500">Email</div>
            <div class="mt-1">{{ currentUser?.email }}</div>
          </div>
          <MailIcon class="w-4 h-4 text-slate-500 ml-auto" />
        </div>
        <div class="flex items-center pt-5">
          <div>
            <div class="text-slate-500">Joined Date</div>
            <div class="mt-1">
              {{ moment(currentUser?.createdAt).format("MMMM DD, YYYY") }}
            </div>
          </div>
          <ClockIcon class="w-4 h-4 text-slate-500 ml-auto" />
        </div>
        <div class="flex items-center pt-5">
          <div>
            <div class="text-slate-500">Avatar</div>
            <div
              v-if="openInput === false"
              @dblclick="hiddenInput"
              class="mt-1 w-4/5"
            >
              {{ addSpaceLinkAvatar(currentUser?.avatar) }}
            </div>
            <textarea
              class="mt-1 text-base"
              v-if="openInput === true"
              v-model.trim="currentUser.avatar"
              @keydown.enter.exact.prevent="
                actionChangeAvatar(currentUser.avatar)
              "
              cols="30"
              rows="5"
            ></textarea>
          </div>
          <UserIcon
            v-if="openInput === true"
            class="w-4 h-4 text-slate-500 ml-auto"
          />
        </div>
      </div>
    </div>
  </TabPanel>
</template>

<script lang="ts">
import { useAuthStore } from "../stores/auth-store";
import { computed, ref } from "vue";
import moment from "moment";
import UserService from "../services/UserService";
import {
  setNotificationFailedWhenGetData,
  setNotificationToastMessage,
} from "../utils/MyFunction";
import { UserInfor } from "../types/user-type";

export default {
  name: "ChatProfile",
  setup() {
    const openInput = ref(false);
    const authStore = useAuthStore();

    const currentUser = computed(() => {
      return authStore.currentUser.userInfor;
    });

    async function hiddenInput() {
      openInput.value = true;
    }

    async function actionChangeAvatar(avatar: string) {
      const data = {
        avatar: avatar,
      } as UserInfor;
      const response = await UserService.updateAvatar(data);
      if (response.data) {
        console.log(response.data);
        if (response.data.success) {
          setNotificationToastMessage("Change avatar successfully", true);
          openInput.value = false;
        } else {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    function addSpaceLinkAvatar(currentUser: string) {
      if (currentUser.includes(" ")) {
        return currentUser;
      } else {
        // Nếu ko có space thì add thêm Space mỗi 27 ký tự
        const currentSplit = currentUser.match(/.{1,40}/g) || [];
        return currentSplit.join(" ");
      }
    }

    return {
      currentUser,
      moment,
      hiddenInput,
      openInput,
      addSpaceLinkAvatar,
      actionChangeAvatar,
    };
  },
};
</script>

<style></style>