import { defineNuxtPlugin } from "#app";
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    // Konfigurasi opsional untuk toast
    timeout: 3000,
    position: "top-right",
  };

  nuxtApp.vueApp.use(Toast, options);
});
