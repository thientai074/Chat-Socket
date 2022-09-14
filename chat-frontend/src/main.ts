import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "./App.vue"
import piniaPersist from "pinia-plugin-persist";
import router from "./router";
import globalComponents from "./global-components";
import utils from "./utils";
import "./assets/css/app.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(router);
app.use(pinia);

globalComponents(app);
utils(app);

app.mount("#app");
