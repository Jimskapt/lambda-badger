import '@babel/polyfill';
import './plugins/vuetify';
import './registerServiceWorker';

import Vue from 'vue';

import App from './App.vue';
import router from './router';
import { store } from './store';
import i18n from './i18n';

Vue.config.productionTip = false;

Vue.use(i18n);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
