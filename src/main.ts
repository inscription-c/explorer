import { createApp } from 'vue';
import { router } from './router';
import App from './App.vue';

// Plugins
import { createPinia } from 'pinia';
import vuetify from './plugins/vuetify';
import VueTablerIcons from 'vue-tabler-icons';
import Maska from 'maska';
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';
import VueScrollTo from 'vue-scrollto';

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
