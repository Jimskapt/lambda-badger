import Vue from 'vue';
import VueRouter from 'vue-router';

import Notes from '../views/Notes.vue';
import Settings from '../views/Settings.vue';
import EditNote from '../views/EditNote.vue';
import ExportData from '../views/ExportData.vue';
import ImportData from '../views/ImportData.vue';
import Help from '../views/Help.vue';

Vue.use(VueRouter);

const routes = [
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
	{
		path: '/help',
		name: 'help',
		component: Help,
	},
	{
		path: '/export',
		name: 'export-data',
		component: ExportData,
	},
	{
		path: '/import',
		name: 'import-data',
		component: ImportData,
	},
];

const router = new VueRouter({
	routes
});

export default router;
