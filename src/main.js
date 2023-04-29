import { createApp } from "vue";

import App from "./App.vue";

import { ElLoading } from "element-plus";

import "./css/style.css";
// use vConsole
//import VConsole from "vconsole";
//const vConsole = new VConsole();

const app = createApp(App);
app.mount("#app");
//app.use(vConsole);
