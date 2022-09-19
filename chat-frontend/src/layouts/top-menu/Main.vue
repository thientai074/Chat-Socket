<template>
  <div class="py-5 md:py-0 -mx-3 px-3 sm:-mx-8 sm:px-8 bg-black/[0.15]">
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <MobileMenu />
    <!-- BEGIN: Top Bar -->
    <div
      class="top-bar-boxed border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:mx-0 px-3 sm:px-8 md:px-6 mb-10 md:mb-8"
    >
      <div class="h-full flex items-center">
        <!-- BEGIN: Logo -->
        <router-link
          :to="{ name: 'top-menu-page-1' }"
          tag="a"
          class="-intro-x hidden md:flex"
        >
          <img
            alt="Tinker Tailwind HTML Admin Template"
            class="w-6"
            src="@/assets/images/logo.svg"
          />
          <span class="text-white text-lg ml-3"> Tinker </span>
        </router-link>
        <!-- END: Logo -->
        <!-- BEGIN: Breadcrumb -->
        <nav aria-label="breadcrumb" class="-intro-x h-full mr-auto">
          <ol class="breadcrumb breadcrumb-light">
            <li class="breadcrumb-item"><a href="#">Application</a></li>
            <li class="breadcrumb-item active" aria-current="page">
              Dashboard
            </li>
          </ol>
        </nav>
        <!-- END: Breadcrumb -->

        <!-- BEGIN: Account Menu -->
        <Dropdown @click="closeUpdateAvatar" class="intro-x w-8 h-8">
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
                @click="openChangeAvatarInput"
                class="dropdown-item hover:bg-white/5"
              >
                <PenToolIcon class="w-4 h-4 mr-2" />
                Change Avatar
              </DropdownItem>
              <div v-if="openFileInput">
                <input type="file" @change="uploadAvatar" />
                <p v-if="uploadAvatarProgress !== 0">
                  Uploading to {{ uploadAvatarProgress }}%
                </p>
                <p v-if="chosenFile && !chosenFile.type.includes('image/')">
                  This is not image file
                </p>
                <button
                  v-if="
                    uploadAvatarProgress === 100 &&
                    chosenFile.type.includes('image/')
                  "
                  class="mt-3 hover:text-purple-500"
                  @click="actionChangeAvatar"
                >
                  Change
                </button>
              </div>
              <DropdownDivider class="border-white/[0.08]" />

              <DropdownItem
                @click="actionLogout"
                class="dropdown-item hover:bg-white/5"
              >
                <LogOutIcon class="w-4 h-4 mr-2" />
                Logout
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
        <!-- END: Account Menu -->
      </div>
    </div>
    <!-- END: Top Bar -->

    <!-- BEGIN: Content -->
    <div class="content content--top-nav">
      <router-view />
    </div>
    <!-- END: Content -->
  </div>
</template>

<script lang="ts">
import { computed, onMounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTopMenuStore } from "../../stores/top-menu";
import { helper as $h } from "../../utils/helper";
import MobileMenu from "../../components/mobile-menu/Main.vue";
import DarkModeSwitcher from "../../components/dark-mode-switcher/Main.vue";
import MainColorSwitcher from "../../components/main-color-switcher/Main.vue";
import {
  searchDropdown,
  showSearchDropdown,
  hideSearchDropdown,
} from "./index";
import { nestedMenu, linkTo } from "@/layouts/side-menu";
import dom from "@left4code/tw-starter/dist/js/dom";
import { useAuthStore } from "../../stores/auth-store";
import { UserInfor } from "../../types/user-type";
import UserService from "../../services/UserService";
import {
  setNotificationFailedWhenGetData,
  setNotificationToastMessage,
} from "../../utils/MyFunction";
import { useConversationStore } from "../../stores/conversation-store";
import ZoomImage from "../../components/ZoomImage.vue";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase";
import { ref as fireBaseRef } from "firebase/storage";

export default {
  components: { DarkModeSwitcher, MobileMenu, MainColorSwitcher, ZoomImage },
  setup() {
    const route: any = useRoute();
    const router = useRouter();
    const formattedMenu = ref([]);
    const topMenuStore = useTopMenuStore();
    const topMenu = computed(() => nestedMenu(topMenuStore.menu, route));
    const authStore = useAuthStore();
    const conversationStore = useConversationStore();
    const openFileInput = ref(false);
    const chosenFile: any = ref(null);
    const newAvatar = ref("");
    const uploadAvatarProgress = ref(0);

    provide("forceActiveMenu", (pageName) => {
      route.forceActiveMenu = pageName;
      formattedMenu.value = $h.toRaw(topMenu.value);
    });

    watch(
      computed(() => route.path),
      () => {
        delete route.forceActiveMenu;
        formattedMenu.value = $h.toRaw(topMenu.value);
      }
    );

    onMounted(() => {
      dom("body")
        .removeClass("error-page")
        .removeClass("login")
        .addClass("main");
      formattedMenu.value = $h.toRaw(topMenu.value);
    });

    const currentUser = computed(() => {
      return authStore.currentUser.userInfor;
    });

    function openChangeAvatarInput() {
      openFileInput.value = true;
    }

    function closeUpdateAvatar () {
      openFileInput.value = false;
      chosenFile.value = null
    }

    const uploadFiles = (file) => {
      //
      if (!file) return;
      const sotrageRef = fireBaseRef(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(sotrageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          uploadAvatarProgress.value = prog;
        },
        (error) => {
          setNotificationToastMessage("Can't upload an avatar", false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            newAvatar.value = downloadURL;           
          });
        }
      );
    };

    async function uploadAvatar(event) {
      chosenFile.value = event.target.files[0];

      if (
        chosenFile.value.name.includes(".jpg") ||
        chosenFile.value.name.includes(".pdf") ||
        chosenFile.value.name.includes(".eps") ||
        chosenFile.value.name.includes(".ai") ||
        chosenFile.value.name.includes(".webp") ||
        chosenFile.value.name.includes(".indd") ||
        chosenFile.value.name.includes(".raw") ||
        chosenFile.value.name.includes(".jpeg") ||
        chosenFile.value.name.includes(".psd") ||
        chosenFile.value.name.includes(".png") ||
        chosenFile.value.name.includes(".gif") ||
        chosenFile.value.name.includes(".tiff") ||
        chosenFile.value.name.includes(".bmp") ||
        chosenFile.value.name.includes(".jfif")
      ) {
        uploadFiles(chosenFile.value);
      } else {
        newAvatar.value = "";
      }
    }

    async function actionChangeAvatar() {
      if (newAvatar.value !== "") {
        const data = {
          avatar: newAvatar.value,
        } as UserInfor;

        const response = await UserService.updateAvatar(data, authStore.token);
        if (response.data) {
          if (response.data.success) {
            setNotificationToastMessage("Change avatar successfully", true);
            authStore.changeAvatar(newAvatar.value);
            openFileInput.value = false;
            chosenFile.value = null;
            uploadAvatarProgress.value = 0;
          } else {
            setNotificationToastMessage(response.data.message, false);
          }
        } else {
          setNotificationFailedWhenGetData();
        }
      }
    }

    async function updateTimeActive() {
      const data = {} as UserInfor;

      const response = await UserService.update(data, authStore.token);
      if (response.data) {
        if (!response.data.success) {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    async function actionLogout() {
      await authStore.logoutUser();
      updateTimeActive();
      await router.push("/login");
    }

    return {
      currentUser,
      actionLogout,
      conversationStore,
      openChangeAvatarInput,
      openFileInput,
      uploadAvatar,
      actionChangeAvatar,
      uploadAvatarProgress,
      chosenFile,
      closeUpdateAvatar
    };
  },
};
</script>
