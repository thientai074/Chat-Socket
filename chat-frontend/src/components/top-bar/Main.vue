<template>
  <!-- BEGIN: Top Bar -->
  <div class="top-bar">
    <!-- BEGIN: Breadcrumb -->
    <nav aria-label="breadcrumb" class="-intro-x mr-auto hidden sm:flex">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Application</a></li>
        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
      </ol>
    </nav>
    <!-- END: Breadcrumb -->

    <!-- BEGIN: Account Menu -->
    <Dropdown class="intro-x w-8 h-8">
      <DropdownToggle
        tag="div"
        role="button"
        class="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in"
      >
        <img
          alt="Tinker Tailwind HTML Admin Template"
          v-bind:src="currentUser?.avatar"
        />
      </DropdownToggle>
      <DropdownMenu class="w-56">
        <DropdownContent class="bg-primary text-white">
          <DropdownHeader tag="div" class="!font-normal">
            <div class="font-medium">{{ currentUser.username }}</div>
            <div class="text-xs text-white/70 dark:text-slate-500 mt-2">
              A man with big love
            </div>
          </DropdownHeader>
          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem
            @click="actionLogout"
            class="dropdown-item hover:bg-white/5"
          >
            <ToggleRightIcon class="w-4 h-4 mr-2" />
            Logout
          </DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
    <!-- END: Account Menu -->
  </div>
  <!-- END: Top Bar -->
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import UserService from "../../services/UserService";
import { useAuthStore } from "../../stores/auth-store";
import { UserInfor } from "../../types/user-type";
import {
  setNotificationFailedWhenGetData,
  setNotificationToastMessage,
} from "../../utils/MyFunction";
export default {
  name: "TopBar",
  setup() {
    const searchDropdown = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();

    const showSearchDropdown = () => {
      searchDropdown.value = true;
    };

    const hideSearchDropdown = () => {
      searchDropdown.value = false;
    };

    const currentUser = computed(() => {
      return authStore.currentUser.userInfor;
    });

    async function updateTimeActive() {
      const data = {} as UserInfor;

      const response = await UserService.update(data);
      if (response.data) {
        if (!response.data.success) {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    async function actionLogout() {
      authStore.logoutUser();
      updateTimeActive()
      await router.push("/login");
    }

    return {
      searchDropdown,
      showSearchDropdown,
      hideSearchDropdown,
      currentUser,
      actionLogout,
    };
  },
};
</script>
