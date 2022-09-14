import {createRouter, createWebHistory} from "vue-router";
import Login from "../views/login/Login.vue";
import Register from "../views/register/Register.vue";
import ErrorPage from "../views/error-page/ErrorPage.vue";
import Cookies from "js-cookie";
import {env} from "../utils/MyVariables";
import {useAuthStore} from "../stores/auth-store";
import SideMenu from "../layouts/side-menu/Main.vue";
import Home from "../views/home/Home.vue";
import TopMenu from "../layouts/top-menu/Main.vue";

const routes = [
    {path: "/register", component: Register},
    {path: "/login", component: Login},
    {
        path: "/error-page",
        name: "error-page",
        component: ErrorPage,
    },
    {
        path: "/:pathMatch(.*)*",
        component: ErrorPage,
    },
    // {
    //   path: "/",
    //   component: SideMenu,
    //   meta: { requiresAuth: true },
    //   children: [
    //     {
    //       path: "/",
    //       name: "side-menu-page-1",
    //       component: Home,
    //     },
    //     {
    //       path: "/chat",
    //       name: "side-menu-page-2",
    //       component: Home,
    //     },
    //   ],
    // },
    {
        path: "/",
        component: TopMenu,
        meta: {requiresAuth: true},
        children: [
            {
                path: "/",
                name: "top-menu-page-1",
                component: Home,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        const authStore = useAuthStore();
        if (Cookies.get(env.nameCookie) && authStore.isAuthenticated) {
            next();
        } else {
            next("/login");
        }
    } else {
        next();
    }
});

export default router;
