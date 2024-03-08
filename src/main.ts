import { createApp } from 'vue';
import { router } from './router';
import App from './App.vue';
import config from './config';

// Plugins
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify';
import VueTablerIcons from 'vue-tabler-icons';
import Maska from 'maska';
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';
import VueScrollTo from 'vue-scrollto';
import * as Sentry from "@sentry/vue";

// CSS
import '@/scss/style.scss';
import 'vuetify-sonner/style.css'

const i18n = createI18n({
    locale: 'en',
    messages: messages,
    silentTranslationWarn: true,
    silentFallbackWarn: true
});

const app = createApp(App);

if (config.sentry.dsn) {
  console.log(`Sentry enabled with environment: ${import.meta.env.MODE}`);

  Sentry.init({
    app,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
    ],
    ...config.sentry,
  });
} else {
  console.log('Sentry disabled');
}

app.use(router);
app.use(createPinia());
app.use(VueTablerIcons);
app.use(i18n);
app.use(Maska);
app.use(vuetify).mount('#app');

//ScrollTop Use
// app.use(VueScrollTo);
app.use(VueScrollTo, {
    duration: 1000,
    easing: "ease"
});
