import Vue from 'vue';
import Vuex from 'vuex';
import PouchDB from 'pouchdb-browser';
import cloneDeep from 'lodash.clonedeep';

import i18n from '@/i18n.js';

Vue.use(Vuex);

const db = new PouchDB('cpdb');
const dbSettings = new PouchDB('cpdb-settings');

const DEFAULT_SETTINGS = {
  locale: 'en-US',
  couchUrl: '',
  darkMode: false,
  allowAutomaticUpdate: false
};

const store = new Vuex.Store({
  strict: true,
  state: {
    settings: DEFAULT_SETTINGS,
    notes: {}
  },
  mutations: {
    setNote(state, payload) {
      if (typeof(payload.data) === 'undefined') {
        console.error('$store.mutations.setNote : missing "data" object on payload');
        return;
      }
      if (typeof(payload.data._id) === 'undefined') {
        console.error('$store.mutations.setNote : missing "_id" value on payload.data');
        return;
      }

      Vue.set(state.notes, payload.data._id, payload.data);
    },
    setLocale(state, payload) {
      if (typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        // TODO check if the key is in available locales

        if (typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        state.settings.locale = payload.value;
        i18n.locale = payload.value;

        dbSettings.get('locale')
          .then((doc) => {
            doc.value = payload.value;
            dbSettings.put(doc);
          })
          .catch((err) => {
            if (err.name === 'not_found') {
              dbSettings.post({
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
    setDarkMode(state, payload) {
      if (typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        if (typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        state.settings.darkMode = payload.value;

        dbSettings.get('dark_mode')
          .then((doc) => {
            doc.value = payload.value;
            dbSettings.put(doc);
          })
          .catch((err) => {
            if (err.name === 'not_found') {
              dbSettings.post({
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
    setCouchURL(state, payload) {
      if (typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        if (typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        state.settings.couchUrl = payload.value;

        dbSettings.get('couch_url')
          .then((doc) => {
            doc.value = payload.value;
            dbSettings.put(doc);
          })
          .catch((err) => {
            if (err.name === 'not_found') {
              dbSettings.post({
                _id: 'couch_url',
                value: payload.value,
              });
            } else {
              // TODO
            }
          });

      } else {
        console.error('$store.mutations.setCouchURL : payload or payload.value is undefined');
      }
    },
    setAllowAutomaticUpdate(state, payload) {
      if (typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        if (typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        state.settings.allowAutomaticUpdate = payload.value;

        dbSettings.get('allow_automatic_update')
          .then((doc) => {
            doc.value = payload.value;
            dbSettings.put(doc);
          })
          .catch((err) => {
            if (err.name === 'not_found') {
              dbSettings.post({
                _id: 'allow_automatic_update',
                value: payload.value,
              });
            } else {
              // TODO
            }
          });

      } else {
        console.error('$store.mutations.setAllowAutomaticUpdate : payload or payload.value is undefined');
      }
    }
  },
  actions: {
    fetchAllNotes(context) {
      return new Promise((resolve, reject) => {
        db.query('all_notes/all_notes', {include_docs: true})
          .then((res) => {
            res.rows.forEach((row) => {
              context.commit('setNote', {data: row.doc});
            });
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getNote(context, payload) {
      return new Promise((resolve, reject) => {
        const found = context.state.notes[payload.id];
        if (typeof(found) !== 'undefined') {
          resolve({find: true, doc: cloneDeep(found)});
        } else {
          db.get(payload.id)
            .then((doc) => {
              resolve({find: true, doc});
            })
            .catch((err) => {
              reject({find: false, err});
            });
        }
      });
    },
    setNote(context, payload) {
      return new Promise((resolve, reject) => {
        if (typeof(payload.data) === 'undefined') {
          reject('$store.actions.setNote : missing "data" object in payload');
          return;
        }

        const okDB = (res) => {
          if (res.ok) {
            db.get(res.id)
              .then((doc) => {
                Vue.set(res, 'doc', doc);
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            reject({message: 'not ok'});
          }
        };

        if (typeof(payload.data._id) === 'undefined') {
          db.post(payload.data)
            .then((res) => {
              okDB(res);
            })
            .catch((err) => { reject(err); });
        } else {
          db.put(payload.data)
            .then((res) => {
              okDB(res);
            })
            .catch((err) => { reject(err); });
        }
      });
    }
  }
})

const allNotes = {
  _id: '_design/all_notes',
  views: {
    all_notes: {
      map: 'function(doc) { if (doc.data_type == "note") { emit(doc._id, true); } }'
    }
  }
}

db.get('_design/all_notes')
  .then((doc) => {
    Vue.set(allNotes, '_rev', doc._rev)
  })
  .catch(() => { }) // no problem
  .finally(() => {
    db.put(allNotes)
      .then(() => {
        store.dispatch('fetchAllNotes');
      })
      .catch((err) => {
        console.error('CPE0004: ', err);
      });

    store.dispatch('fetchAllNotes')
      .catch((err) => {
        console.error('CPE0005: ', err);
      });
  });

dbSettings.get('locale')
.then((doc) => {
  store.commit('setLocale', {value: doc.value});
})
.catch(() => {}); // error are not important

dbSettings.get('dark_mode')
.then((doc) => {
  store.commit('setDarkMode', {value: doc.value});
})
.catch(() => {}); // error are not important

dbSettings.get('couch_url')
.then((doc) => {
  store.commit('setCouchURL', {value: doc.value});
})
.catch(() => {}); // error are not important

dbSettings.get('allow_automatic_update')
.then((doc) => {
  store.commit('setAllowAutomaticUpdate', {value: doc.value});
})
.catch(() => {}); // error are not important

db.changes({
  include_docs: true,
})
  .on('change', (change) => {
    if (change.doc.data_type === 'note') {
      store.commit('setNote', { data: change.doc });
    }
  });

export default store;
