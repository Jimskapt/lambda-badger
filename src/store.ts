import Vue from 'vue';
import Vuex from 'vuex';
import PouchDB from 'pouchdb-browser';

import i18n from '@/i18n';

Vue.use(Vuex);

const db = new PouchDB('cpdb');

const DEFAULT_SETTINGS = {
  locale: 'en-US',
  darkMode: false,
};

const store = new Vuex.Store({
  strict: true,
  state: {
    settings: DEFAULT_SETTINGS,
  },
  mutations: {
    setLocale(state, payload: any) {
      if (typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        // TODO check if the key is in available locales

        if (typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        state.settings.locale = payload.value;
        i18n.locale = payload.value;

        db.get('locale')
        .then((doc: any) => {
          doc.value = payload.value;
          db.put(doc);
        })
        .catch((err) => {
          if (err.name === 'not_found') {
            db.post({
              _id: 'locale',
              value: payload.value,
            });
          } else {
            // TODO
          }
        });

      } else {
        console.error('$store.mutations.setLocale : payload or payload.value is undefined');
      }
    },
    setDarkMode(state, payload: any) {
      if (typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        if (typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        state.settings.darkMode = payload.value;

        db.get('dark_mode')
        .then((doc: any) => {
          doc.value = payload.value;
          db.put(doc);
        })
        .catch((err) => {
          if (err.name === 'not_found') {
            db.post({
              _id: 'dark_mode',
              value: payload.value,
            });
          } else {
            // TODO
          }
        });

      } else {
        console.error('$store.mutations.setDarkMode : payload or payload.value is undefined');
      }
    },
  },
  actions: {

  },
});

db.get('locale')
.then((doc: any) => {
  store.commit('setLocale', {value: doc.value});
})
.catch((err) => {}); // error are not important

db.get('dark_mode')
.then((doc: any) => {
  store.commit('setDarkMode', {value: doc.value});
})
.catch((err) => {}); // error are not important

export default store;
