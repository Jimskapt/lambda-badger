import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import i18n from '@/i18n';

Vue.use(Vuetify, {
    lang: {
        t: (key: string, ...params: any[]) => i18n.t(key, params),
    },
});
