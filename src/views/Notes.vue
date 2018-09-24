<template lang="pug">
div
	v-toolbar(color="primary", class="mb-2 mx-1", style="border-radius: 2px;")
		v-toolbar-side-icon(:to="{name: 'edit-note', params: {id: 1}}")
			v-icon event_note
		v-toolbar-title {{ $t('Notes') }}
	v-alert(type="info", :value="notes.length <= 0")
		span {{ $t('There is no notes') }}.
		br
		router-link(style="color:white;", :to="{name: 'edit-note', params: {id: 1}}") {{ $t('Create a note') }}
	v-autocomplete(
		v-model="subjectsFilters",
		:items="Object.keys($store.state.subjects)",
		:label="$t('Filter')",
		class="mb-2 mx-1",
		prepend-inner-icon="filter_list",
		v-if="notes !== undefined && notes.length > 0",
		@blur="saveFilter",
		flat, multiple, dense, chips, deletable-chips, small-chips, clearable, solo, hide-no-data, hide-details)
	v-layout(wrap)
		v-flex(v-for="note in filtered_notes", :key="note._id", pa-1, d-flex)
			note-display(:id="note._id", :title="note.title", :content="note.content", :confidential="note.confidential", :subjects="note.subjects")
	v-btn(large, icon, fixed, bottom, right, color="primary", :to="{name: 'edit-note', params: {id: 1}}")
		v-icon add
</template>

<script>
import NoteDisplay from '@/components/note-display.vue';

export default {
	name: 'notes',
	data() {
		return {
			subjectsFilters: [],
		};
	},
	components: {
		'note-display': NoteDisplay,
	},
	watch: {
		'$store.state.settings.notes_filter': function(value) {
			this.subjectsFilters = value;
		},
	},
	computed: {
		filtered_notes () {
			return this.notes.filter((note) => {
				let result = !(this.subjectsFilters.length > 0);

				if(typeof(note.subjects) !== 'undefined') {
					for (let i = 0; i < note.subjects.length; i++) {
						if(this.subjectsFilters.includes(note.subjects[i])) {
							result = true;
							break;
						}
					}
				}

				return result;
			});
		},
		notes () {
			return Object.keys(this.$store.state.notes).map((key) => {
				return this.$store.state.notes[key];
			});
		},
	},
	methods: {
		saveFilter() {
			this.$store.dispatch('setNotesFilter', {value: this.subjectsFilters});
		},
	},
	mounted() {
		this.subjectsFilters = this.$store.state.settings.notes_filter;
	},
};
</script>