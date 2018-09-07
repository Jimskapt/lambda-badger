import '@babel/polyfill';
import './registerServiceWorker';

import './plugins/vuetify.js';
import './plugins/vue-toasted.js';

import Vue from 'vue';

import App from './App.vue';
import router from './router.js';
import store from './store.js';
import i18n from './i18n.js';

Vue.config.productionTip = false;

Vue.use(i18n);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
