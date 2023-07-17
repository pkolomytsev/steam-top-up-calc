import { createApp } from "vue";
import "vuetify/lib/styles/main.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import App from "./App.vue";

const app = createApp(App);
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
});

app.use(vuetify);
app.mount("#app");
