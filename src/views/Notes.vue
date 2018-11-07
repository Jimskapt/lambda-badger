<template lang="pug">
div
	v-toolbar(dark, color="primary", class="mb-2 mx-1", style="border-radius: 2px;")
		v-toolbar-side-icon(:to="{name: 'edit-note', params: {id: 1}}")
			v-icon event_note
		v-toolbar-title {{ $t('Notes') }}
		v-spacer
		v-tooltip(bottom)
			v-btn(icon, :to="{name:'export-data'}", slot="activator")
				v-icon unarchive
			span {{ $t('Export your data manually') }}
		v-tooltip(bottom)
			v-btn(icon, :to="{name:'import-data'}", slot="activator")
				v-icon archive
			span {{ $t('Import your data manually') }}
	v-alert(type="info", :value="notes.length <= 0")
		span {{ $t('There is no notes') }}.
		br
		router-link(style="color:white;", :to="{name: 'edit-note', params: {id: 1}}") {{ $t('Create a note') }}
	notes-filter(v-model="filters", v-if="notes !== undefined && notes.length > 0")
	v-layout(wrap)
		v-flex(v-for="note in filtered_notes", :key="note._id", pa-1, d-flex)
			note-display(
				:id="note._id",
				:title="note.title",
				:content="note.content",
				:confidential="note.confidential",
				:subjects="note.subjects",
				:is_archive="note.archived === true")
	v-btn(large, icon, fixed, bottom, right, color="primary", :to="{name: 'edit-note', params: {id: 1}}")
		v-icon add
</template>

<script>
import NoteDisplay from '@/components/note-display.vue';
import NotesFilter from '@/components/notes-filter.vue';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';

function notesAreSame(a, b) {
  return  a.title === b.title &&
          a.content === b.content &&
          a.data_type === b.data_type &&
          isEqual(a.subjects, b.subjects);
}

export default {
	name: 'notes',
	data() {
		return {
			filters: {
				subjects: [],
				show_archives: false,
			},
		};
	},
	components: {
		'note-display': NoteDisplay,
		'notes-filter': NotesFilter,
	},
	watch: {
		'$i18n.locale': function() {
			this.updateInitNotes();
		},
		'$store.state.notes_loaded': function(value) {
			if(value === true) {
				this.updateInitNotes();
			}
		},
		'$store.state.settings.notes_filter': function(value) {
			this.filters.subjects = value;
		},
		'filters.subjects': function() {
			this.saveFilter();
		},
	},
	computed: {
		filtered_notes() {
			return this.notes.filter((note) => {
				let result = !(this.filters.subjects.length > 0);

				if(typeof(note.subjects) !== 'undefined') {
					if(this.filters.subjects.includes('*' + this.$t('no subject') + '*') && note.subjects.length === 0) {
						result = true;
					} else {
						for (let i = 0; i < note.subjects.length; i++) {
							if(this.filters.subjects.includes(note.subjects[i])) {
								result = true;
								break;
							}
						}
					}
				} else {
					if(this.filters.subjects.includes('*' + this.$t('no subject') + '*')) {
						result = true;
					}
				}

				if(this.filters.show_archives === false) {
					result &= (note.archived !== true);
				}

				return result;
			});
		},
		notes() {
			return Object.keys(this.$store.state.notes).map((key) => {
				return this.$store.state.notes[key];
			});
		},
		availableSubjects() {
			let result = ['*' + this.$t('no subject') + '*'];

			result = result.concat(Object.keys(this.$store.state.subjects));

			return result;
		}
	},
	methods: {
		saveFilter() {
			if(this.filters.subjects !== this.$store.state.settings.notes_filter) {
				this.$store.dispatch('setNotesFilter', {value: this.filters.subjects});
			}
		},
		updateInitNotes() {
			/* eslint-disable no-undef */
			let locale = this.$i18n.locale;
			if(typeof(INITIAL_STATE.contents[this.$i18n.locale]) === 'undefined') {
				locale = 'en-US';
				console.warn(this.$i18n.locale, 'does not exists in INITIAL_STATE.contents, fall back to en-US locale.');
			}

			if(Object.keys(this.$store.state.notes).length <= 0) {
				if(typeof(INITIAL_STATE) !== 'undefined' && typeof(INITIAL_STATE.contents) !== 'undefined') {
					for (let i = 0; i < INITIAL_STATE.contents[locale].length; i++) {
						const note = cloneDeep(INITIAL_STATE.contents[locale][i]);
						note.data_type = 'note';
						this.$store.dispatch('setNote', {data: note});
					}
				}
			} else {
				for (let i = 0; i < INITIAL_STATE.contents[locale].length; i++) {
					const note = cloneDeep(INITIAL_STATE.contents[locale][i]);
					note.data_type = 'note';

					if(typeof(note._id) !== 'undefined') {
						const found = this.$store.state.notes[note._id];
						if(typeof(found) !== 'undefined' && !notesAreSame(note, found)) {
							note._rev = found._rev;
							this.$store.dispatch('setNote', {data: note});
						}
					}
				}
			}
			/* eslint-enable no-undef */
		},
	},
	mounted() {
		this.filters.subjects = this.$store.state.settings.notes_filter;

		if(this.$store.state.notes_loaded === true) {
			this.updateInitNotes();
		}
	},
};
</script>