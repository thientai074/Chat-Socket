<template>
  <div class="top-bar -mx-4 px-4 md:mx-0 md:px-0">
    <!-- BEGIN: Breadcrumb -->
    <nav aria-label="breadcrumb" class="-intro-x mr-auto hidden sm:flex">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Application</a></li>
        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
      </ol>
    </nav>
    <!-- END: Breadcrumb -->

    <!-- BEGIN: Account Menu -->
    <div class="intro-x dropdown w-8 h-8">
      <div
          class="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in"
          role="button"
          aria-expanded="false"
          data-tw-toggle="dropdown"
      >
        <img
            alt="Midone - HTML Admin Template"
            v-bind:src="currentUser?.avatar"
        />
      </div>
      <div class="dropdown-menu w-56">
        <ul class="dropdown-content bg-primary text-white">
          <li class="p-2">
            <div class="font-medium">{{ currentUser?.username }}</div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">
              DevOps Engineer
            </div>
          </li>
          <li>
            <hr class="dropdown-divider border-white/[0.08]"/>
          </li>
          <li>
            <a class="dropdown-item hover:bg-white/5" @click="actionLogout">
              <i data-lucide="toggle-right" class="w-4 h-4 mr-2"></i> Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- END: Account Menu -->
  </div>
</template>

<script lang="ts">
import {useAuthStore} from "../stores/auth-store";
import {computed} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "TopBar",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const currentUser = computed(() => {
      return authStore.currentUser.userInfor;
    });

    async function actionLogout() {
      authStore.logoutUser();
      await router.push("/login");
    }

    return {
      currentUser,
      actionLogout,
    };
  },
};
</script>

<style></style>
