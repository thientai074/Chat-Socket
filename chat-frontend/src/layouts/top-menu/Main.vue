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
        <!-- BEGIN: Search -->
        <!-- <div class="intro-x relative mr-3 sm:mr-6">
          <div class="search hidden sm:block">
            <input
              type="text"
              class="search__input form-control border-transparent"
              placeholder="Search..."
              @focus="showSearchDropdown"
              @blur="hideSearchDropdown"
            />
            <SearchIcon class="search__icon dark:text-slate-500" />
          </div>
          <a class="notification notification--light sm:hidden" href="">
            <SearchIcon class="notification__icon dark:text-slate-500" />
          </a>
          <div class="search-result" :class="{ show: searchDropdown }">
            <div class="search-result__content">
              <div class="search-result__content__title">Pages</div>
              <div class="mb-5">
                <a href="" class="flex items-center">
                  <div
                    class="w-8 h-8 bg-success/20 dark:bg-success/10 text-success flex items-center justify-center rounded-full"
                  >
                    <InboxIcon class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Mail Settings</div>
                </a>
                <a href="" class="flex items-center mt-2">
                  <div
                    class="w-8 h-8 bg-pending/10 text-pending flex items-center justify-center rounded-full"
                  >
                    <UsersIcon class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Users & Permissions</div>
                </a>
                <a href="" class="flex items-center mt-2">
                  <div
                    class="w-8 h-8 bg-primary/10 dark:bg-primary/20 text-primary/80 flex items-center justify-center rounded-full"
                  >
                    <CreditCardIcon class="w-4 h-4" />
                  </div>
                  <div class="ml-3">Transactions Report</div>
                </a>
              </div>
              <div class="search-result__content__title">Users</div>
              <div class="mb-5">
                <a
                  v-for="(faker, fakerKey) in $_.take($f(), 4)"
                  :key="fakerKey"
                  href
                  class="flex items-center mt-2"
                >
                  <div class="w-8 h-8 image-fit">
                    <img
                      alt="Tinker Tailwind HTML Admin Template"
                      class="rounded-full"
                      :src="faker.photos[0]"
                    />
                  </div>
                  <div class="ml-3">{{ faker.users[0].name }}</div>
                  <div
                    class="ml-auto w-48 truncate text-slate-500 text-xs text-right"
                  >
                    {{ faker.users[0].email }}
                  </div>
                </a>
              </div>
              <div class="search-result__content__title">Products</div>
              <a
                v-for="(faker, fakerKey) in $_.take($f(), 4)"
                :key="fakerKey"
                href
                class="flex items-center mt-2"
              >
                <div class="w-8 h-8 image-fit">
                  <img
                    alt="Tinker Tailwind HTML Admin Template"
                    class="rounded-full"
                    :src="faker.images[0]"
                  />
                </div>
                <div class="ml-3">{{ faker.products[0].name }}</div>
                <div
                  class="ml-auto w-48 truncate text-slate-500 text-xs text-right"
                >
                  {{ faker.products[0].category }}
                </div>
              </a>
            </div>
          </div>
        </div> -->
        <!-- END: Search -->
        <!-- BEGIN: Notifications -->
        <!-- <Dropdown class="intro-x mr-4 sm:mr-6">
          <DropdownToggle
            tag="div"
            role="button"
            class="notification notification--light notification--bullet cursor-pointer"
          >
            <BellIcon class="notification__icon dark:text-slate-500" />
          </DropdownToggle>
          <DropdownMenu class="notification-content pt-2">
            <DropdownContent tag="div" class="notification-content__box">
              <div class="notification-content__title">Notifications</div>
              <div
                v-for="(faker, fakerKey) in $_.take($f(), 5)"
                :key="fakerKey"
                class="cursor-pointer relative flex items-center"
                :class="{ 'mt-5': fakerKey }"
              >
                <div class="w-12 h-12 flex-none image-fit mr-1">
                  <img
                    alt="Tinker Tailwind HTML Admin Template"
                    class="rounded-full"
                    :src="faker.photos[0]"
                  />
                  <div
                    class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white"
                  ></div>
                </div>
                <div class="ml-2 overflow-hidden">
                  <div class="flex items-center">
                    <a href="javascript:;" class="font-medium truncate mr-5">{{
                      faker.users[0].name
                    }}</a>
                    <div
                      class="text-xs text-slate-400 ml-auto whitespace-nowrap"
                    >
                      {{ faker.times[0] }}
                    </div>
                  </div>
                  <div class="w-full truncate text-slate-500 mt-0.5">
                    {{ faker.news[0].shortContent }}
                  </div>
                </div>
              </div>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown> -->
        <!-- END: Notifications -->
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
import { useConversationStore } from '../../stores/conversation-store';
import ZoomImage from "../../components/ZoomImage.vue"
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
      updateTimeActive();
      await router.push("/login");
    }

    return {
      currentUser,
      actionLogout,
      conversationStore
    };
  },
};
</script>
