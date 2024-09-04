import "./assets/style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import Settings from "./Settings.vue";

const pinia = createPinia();
const app = createApp(Settings);

app.use(pinia);
app.mount("#settings");
