import Vue from 'vue';

import vuetify from './plugins/vuetify';
import './plugins/vue-toasted.js';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n.js';

import 'core-js/stable';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(i18n);

new Vue({
	router,
	store,
	i18n,
	vuetify,
	render: h => h(App)
}).$mount('#app');
