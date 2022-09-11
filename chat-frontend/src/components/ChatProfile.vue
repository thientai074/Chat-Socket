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
          <MailIcon class="w-4 h-4 text-slate-500 ml-auto"/>
        </div>
        <div class="flex items-center pt-5">
          <div>
            <div class="text-slate-500">Joined Date</div>
            <div class="mt-1"> {{ moment(currentUser?.createdAt).format("MMMM DD, YYYY") }}</div>
          </div>
          <ClockIcon class="w-4 h-4 text-slate-500 ml-auto"/>
        </div>
      </div>
    </div>
  </TabPanel>
</template>

<script lang="ts">
import {useAuthStore} from "../stores/auth-store";
import {computed} from "vue";
import moment from "moment";

export default {
  name: "ChatProfile",
  setup() {
    const authStore = useAuthStore();

    const currentUser = computed(() => {
      return authStore.currentUser.userInfor;
    });

    return {
      currentUser,
      moment,
    };
  },
};
</script>

<style></style>
