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
  allowAutomaticUpdate: false,
  currentSync: null,
};

let dbSync = null;

const store = new Vuex.Store({
  strict: true,
  state: {
    settings: DEFAULT_SETTINGS,
    notes: {},
  },
  mutations: {
    setNote(state, payload) {
      if(typeof(payload.data) === 'undefined') {
        console.error('$store.mutations.setNote : missing "data" object on payload');
        return;
      }
      if(typeof(payload.data._id) === 'undefined') {
        console.error('$store.mutations.setNote : missing "_id" value on payload.data');
        return;
      }

      Vue.set(state.notes, payload.data._id, payload.data);
      
      if(payload.no_toast !== true) {
        Vue.toasted.show(i18n.t('A note has been updated (or added)'), { duration: 2000, type: 'info', icon: 'edit' });
      }
    },
    deleteNote(state, payload) {
      if(typeof(payload.data) === 'undefined') {
        console.error('$store.mutations.deleteNote : missing "data" object in payload');
        return;
      }
      if(typeof(payload.data._id) === 'undefined') {
        console.error('$store.mutations.deleteNote : missing "_id" key on payload object');
        return;
      }

      Vue.delete(state.notes, payload.data._id);
      Vue.toasted.show(i18n.t('A note has deleted'), { duration: 2000, type: 'info', icon: 'delete' });
    },
    setLocale(state, payload) {
      if(typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        // TODO check if the key is in available locales

        if(typeof(state.settings) === 'undefined') {
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
            if(err.name === 'not_found') {
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
      if(typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        if(typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        state.settings.darkMode = payload.value;

        dbSettings.get('dark_mode')
          .then((doc) => {
            doc.value = payload.value;
            dbSettings.put(doc);
          })
          .catch((err) => {
            if(err.name === 'not_found') {
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
      if(typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        if(typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        payload.value = payload.value.trim();
        state.settings.couchUrl = payload.value;

        dbSettings.get('couch_url')
          .then((doc) => {
            doc.value = payload.value;
            dbSettings.put(doc);
          })
          .catch((err) => {
            if(err.name === 'not_found') {
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
      if(typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        if(typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }
        state.settings.allowAutomaticUpdate = payload.value;

        dbSettings.get('allow_automatic_update')
          .then((doc) => {
            doc.value = payload.value;
            dbSettings.put(doc);
          })
          .catch((err) => {
            if(err.name === 'not_found') {
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
    },
    setCurrentSync(state, payload) {
      if(typeof(payload) !== 'undefined' && typeof(payload.value) !== 'undefined') {
        if(typeof(state.settings) === 'undefined') {
          state.settings = DEFAULT_SETTINGS;
        }

        state.settings.currentSync = payload.value;
      } else {
        console.error('$store.mutations.setAllowAutomaticUpdate : payload or payload.value is undefined');
      }
    },
  },
  actions: {
    fetchAllNotes(context) {
      return new Promise((resolve, reject) => {
        db.query('all_notes/all_notes', {include_docs: true})
          .then((res) => {
            res.rows.forEach((row) => {
              context.commit('setNote', {data: row.doc, no_toast: true});
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
        if(typeof(found) !== 'undefined') {
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
        if(typeof(payload.data) === 'undefined') {
          reject('$store.actions.setNote : missing "data" object in payload');
          return;
        }

        const okDB = (res) => {
          if(res.ok) {
            db.get(res.id)
              .then((doc) => {
                Vue.set(res, 'doc', doc);
                resolve(res);
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            reject({message: 'not ok'}); // TODO
          }
        };

        payload.data.app_version = require('../package.json').version;

        if(typeof(payload.data._id) === 'undefined') {
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
    },
    deleteNote(context, payload) {
      return new Promise((resolve, reject) => {
        if(typeof(payload.data) === 'undefined') {
          reject('$store.actions.deleteNote : missing "data" object in payload');
          return;
        }
        if(typeof(payload.data._id) === 'undefined') {
          reject('$store.actions.deleteNote : missing "_id" key on payload object');
          return;
        }
        if(typeof(payload.data._rev) === 'undefined') {
          reject('$store.actions.deleteNote : missing "_rev" key on payload object');
          return;
        }

        let confirmedDelete = (payload.force === true);
        if(confirmedDelete !== true) {
          confirmedDelete = confirm(i18n.t('Please confirm the deletion of this note'));
        }

        if(confirmedDelete) {
          db.remove(payload.data)
            .then((res) => {
              context.commit('deleteNote', payload);
              resolve(res);
            })
            .catch((err) => { reject(err); });
        }
      });
    },
    startSyncDB(context, payload) {
      if(typeof(payload) === 'undefined') {
        payload = {
          force: false,
        };
      }

      new Promise((resolve) => {
        if(dbSync !== null && store.state.settings.couchUrl !== store.state.settings.currentSync) {
          context.dispatch('stopSyncDB').then(() => { resolve(); });
        } else {
          resolve();
        }
      })
        .then(() => {
          // TODO : check URL
          if(store.state.settings.couchUrl !== '' && (store.state.settings.allowAutomaticUpdate === true || payload.force === true)) {
            dbSync = PouchDB.sync('cpdb', new PouchDB(store.state.settings.couchUrl), { live: true, retry: true })
              .on('active', () => {
                Vue.toasted.show(i18n.t('Connection to the remote database established'), { duration: 2000, type: 'success', icon: 'storage' });
                
                store.commit('setCurrentSync', { value: store.state.settings.couchUrl });
    
                if(payload.force === true) {
                  setTimeout(function() {
                    context.dispatch('stopSyncDB');
                  }, 2000);
                }
              })
              .on('error', (err) => { alert('CPE0006: Error while synchronising database : ' + err); }); // TODO
          }
        })
        .catch((err) => { alert('CPE0007: ' + err); });
    },
    stopSyncDB() {
      return new Promise((resolve) => {
        if(dbSync !== null) {
          dbSync.cancel();
    
          dbSync.on('complete', () => {
            dbSync = null;
            store.commit('setCurrentSync', { value: null });
            Vue.toasted.show(i18n.t('Stopping connection to the remote database'), { duration: 2000, type: 'info', icon: 'close' });
            resolve();
          });
        } else {
          console.log('Database connection is already stopped');
        }
      });
    },
  },
});

const allNotes = {
  _id: '_design/all_notes',
  views: {
    all_notes: {
      map: 'function(doc) { if(doc.data_type == "note") { emit(doc._id, true); } }',
    },
  },
};

db.get('_design/all_notes')
  .then((doc) => {
    Vue.set(allNotes, '_rev', doc._rev);

    if(doc.views.all_notes.map !== allNotes.views.all_notes.map) {
      db.put(allNotes)
        .then(() => {
          console.log('_design/all_notes updated');
        })
        .catch((err) => {
          console.error('CPE0004: ', err);
        });
    }
  })
  .catch((err) => { 
    if(err.status === 404) {
      db.post(allNotes)
        .then(() => {
          console.log('_design/all_notes created');
        })
        .catch((err2) => {
          console.error('CPE0010: ', err2);
        });
    } else {
      console.error('CPE0011: ', err);
    }
   })
  .finally(() => {
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
    store.dispatch('startSyncDB');
  })
  .catch(() => {}); // error are not important

db.setMaxListeners(20);
db.changes({
  since: 'now',
  live: true,
  include_docs: true,
})
  .on('change', (change) => {
    if(change.doc.data_type === 'note') {
      console.log('DB:change:', change.doc);
      store.commit('setNote', { data: change.doc });
    } else if(change.deleted === true && typeof(store.state.notes[change.doc._id]) !== 'undefined') {
      console.log('DB:delete:', change.doc);
      store.commit('deleteNote', { data: change.doc });
    }
  })
  .on('error', (err) => {
    console.log('zrfrfgazrgerg', err);
  });

export default store;
