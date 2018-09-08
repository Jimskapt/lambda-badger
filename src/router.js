import Vue from 'vue';
import Router from 'vue-router';

import Notes from './views/Notes.vue';
import Settings from './views/Settings.vue';
import EditNote from './views/EditNote.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {
        name: 'notes'
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/notes',
      name: 'notes',
      component: Notes,
    },
    {
      path: '/note/edit/:id',
      name: 'edit-note',
      component: EditNote,
      props: true,
    },
  ],
});
