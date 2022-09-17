import { defineStore, StoreDefinition } from "pinia";
import Cookies from "js-cookie";
import { User, UserInfor } from "../types/user-type";
import { env } from "../utils/MyVariables";
import UserService from "../services/UserService";

export const useAuthStore: StoreDefinition = defineStore({
  id: "auth",
  state: () => ({
    currentUser: {} as User | {},
    isAuthenticated: false,
    activeUser: [] as string[],
    token: "" as string | undefined,
  }),
  getters: {},
  actions: {
    loginUser(user: User) {
      this.currentUser = user;
      this.isAuthenticated = true;
      Cookies.set(env.nameCookie, user.accessToken);
    },

    getToken() {
      this.token = Cookies.get(env.nameCookie);
    },

    async getUser() {
      if (this.token) {
        const data = {} as UserInfor;
        const response = await UserService.findOne(data, this.token);
        this.currentUser = response.data.values;
      }
    },

    logoutUser() {
      Cookies.remove(env.nameCookie);
    },

    findActiveUser(activeUserArray: string[]) {
      this.activeUser = activeUserArray;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "Chat",
        storage: localStorage,
      },
    ],
  },
});
