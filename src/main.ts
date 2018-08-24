import '@babel/polyfill';
import './registerServiceWorker';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import Vue from 'vue';
import App from './App.vue';

import './plugins/vuetify';

import i18n from './i18n';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
