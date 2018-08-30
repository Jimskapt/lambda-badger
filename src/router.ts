import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';
import EditNote from './views/EditNote.vue';
import Notes from './views/Notes.vue';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/note/edit/:id',
      name: 'edit-note',
      component: EditNote,
      props: true,
    },
    {
      path: '/notes',
      name: 'notes',
      component: Notes,
    },
  ],
});
