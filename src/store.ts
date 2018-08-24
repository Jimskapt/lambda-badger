import Vue from 'vue';
import Vuex from 'vuex';
import PouchDB from 'pouchdb-browser';

Vue.use(Vuex);

const db = new PouchDB('cpdb');

export default new Vuex.Store({
  strict: true,
  state: {

  },
  mutations: {

  },
  actions: {

  },
});
