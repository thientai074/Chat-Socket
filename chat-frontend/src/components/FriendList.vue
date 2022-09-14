<template>
  <TabPanel>
    <div class="pr-1">
      <div class="box p-5 mt-5">
        <div class="relative text-slate-500">
          <input
              type="text"
              class="form-control py-3 px-4 border-transparent bg-slate-100 pr-10"
              placeholder="Search for users..."
              v-model="usernameKeyword"
              v-on:keyup="actionFindNotFriends"
          />
          <SearchIcon
              class="w-4 h-4 hidden sm:absolute my-auto inset-y-0 mr-3 right-0"
          />
        </div>
        <button type="button" class="btn btn-primary w-full mt-3">
          Invite Friends
        </button>
      </div>
    </div>
    <div
        v-if="usernameKeyword === ''"
        class="chat__user-list overflow-y-auto scrollbar-hidden pr-1 pt-1"
    >
      <div v-for="firstLetter in friends" :key="firstLetter._id">
        <div class="mt-4 text-slate-500">
          {{ firstLetter.alphabet.toUpperCase() }}
        </div>
        <SingleFriend
            v-for="friend in firstLetter.user"
            :key="friend._id"
            :friend="friend"
        />
      </div>
    </div>
    <div
        v-else
        class="chat__user-list overflow-y-auto scrollbar-hidden pr-1 pt-1"
    >
      <SingleStranger
          v-for="stranger in strangers"
          :key="stranger._id"
          :stranger="stranger"
      />
    </div>
  </TabPanel>
</template>

<script lang="ts">
import {onMounted, ref} from "vue";
import SingleFriend from "./SingleFriend.vue";
import SingleStranger from "./SingleStranger.vue";
import UserService from "../services/UserService";
import {
  setNotificationFailedWhenGetData,
  setNotificationToastMessage,
} from "../utils/MyFunction";
import {AlphabetUser, UserInfor} from "../types/user-type";

export default {
  name: "FriendList",
  components: {SingleFriend, SingleStranger},
  setup() {
    const usernameKeyword = ref("");
    const friends = ref<AlphabetUser[]>([]);
    const strangers = ref<UserInfor[]>([]);

    const friendsResponse = ref<UserInfor[]>([]);

    async function actionFindNotFriends() {
      const data = {
        username: usernameKeyword.value,
      } as UserInfor;

      const response = await UserService.findNotFriends(data);
      if (response.data) {
        if (response.data.success) {
          strangers.value = response.data.values;
        } else {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    async function actionFindFriends() {
      const data = {} as UserInfor;
      const response = await UserService.findFriends(data);

      if (response.data) {
        if (response.data.success) {
          friendsResponse.value = response.data.values;

          // Logic to find stranger by alphabet
          let friendSortAlphabet = friendsResponse.value.sort((a, b) =>
              a.username.localeCompare(b.username, "es", {sensitivity: "base"})
          );

          let data = friendSortAlphabet.reduce((r, e) => {
            // get first letter of name of current element
            let alphabet = e.username[0];

            // if there is no property in accumulator with this letter create it
            if (!r[alphabet]) r[alphabet] = {alphabet, user: [e]};
            // if there is push current element to children array for that letter
            else r[alphabet].user.push(e);

            // return accumulator
            return r;
          }, {});

          friends.value = Object.values(data);
        } else {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    onMounted(() => {
      actionFindFriends();
    });

    return {
      friends,
      usernameKeyword,
      actionFindNotFriends,
      strangers,
    };
  },
};
</script>

<style></style>
