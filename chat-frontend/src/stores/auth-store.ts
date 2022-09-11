import {defineStore, StoreDefinition} from "pinia";
import Cookies from "js-cookie";
import {User} from "../types/user-type";
import {env} from "../utils/MyVariables";

export const useAuthStore: StoreDefinition = defineStore({
    id: "auth",
    state: () => ({
        currentUser: {} as User | {},
        isAuthenticated: false,
        activeUser: [] as string[]
    }),
    getters: {},
    actions: {
        loginUser(user: User) {
            this.currentUser = user;
            this.isAuthenticated = true;
        },

        logoutUser() {
            Cookies.remove(env.nameCookie);
        },

        findActiveUser(activeUserArray: string[]) {
            this.activeUser = activeUserArray
        }
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