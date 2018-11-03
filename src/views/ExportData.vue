<template lang="pug">
div
	v-container
		v-btn(color="secondary", @click="$router.back()")
			v-icon chevron_left
			span {{ $t('Go back') }}
	v-card
		v-toolbar(color="primary")
			v-toolbar-side-icon
				v-icon archive
			v-toolbar-title {{ $t('Export your data manually') }}
		v-card-text
			notes-filter(v-model="filters")
			div(class="mx-1")
				v-checkbox(:label="$t('Make it human readable')", v-model="readable")
				v-checkbox(:label="$t('Include confidential notes')", v-model="show_confidential")
			v-alert(type="info", :value="true") {{ $t('In order to save your data, just copy and paste the following data in an text editor (like notepad), and then save it as *.json file.') }}
			v-divider(class="my-3")
			v-textarea(:label="$t('Your data')", readonly, hide-details, auto-grow, v-model="dbData")
</template>

<script>
import NotesFilter from '@/components/notes-filter.vue';

export default {
	name: 'export-data',
	data() {
		return {
			readable: true,
			show_confidential: true,
			filters: {
				subjects: [],
				show_archives: false,
			},
		};
	},
	components: {
		'notes-filter': NotesFilter,
	},
	computed: {
		notes () {
			return Object.keys(this.$store.state.notes).map((key) => {
				return this.$store.state.notes[key];
			});
		},
		filtered_notes () {
			const that = this;

			return this.notes.filter((note) => {

				const archiveFilter = function() {
					if(that.filters.show_archives === true) {
						return true;
					} else {
						return !(note.archived === true);
					}
				}

				const confidentialFilter = function() {
					return !(that.show_confidential === false && note.confidential === true);
				}

				const subjectFilter = function() {
					let result = !(that.filters.subjects.length > 0);

					if(typeof(note.subjects) !== 'undefined') {
						if(that.filters.subjects.includes('*' + that.$t('no subject') + '*') && note.subjects.length === 0) {
							result = true;
						} else {
							for (let i = 0; i < note.subjects.length; i++) {
								if(that.filters.subjects.includes(note.subjects[i])) {
									result = true;
									break;
								}
							}
						}
					} else {
						if(that.filters.subjects.includes('*' + that.$t('no subject') + '*')) {
							result = true;
						}
					}

					return result;
				}

				return archiveFilter() && confidentialFilter() && subjectFilter();
			});
		},
		dbData() {
			return JSON.stringify(
				{
					notes: {
						filters: {
							subjects: this.filters.subjects.map((filter) => { return (filter === '*' + this.$t('no subject') + '*') ? '*no subject*' : filter; }),
							show_archives: this.filters.show_archives,
							show_confidential: this.show_confidential,
						},
						items: this.filtered_notes,
					},
					app_version: require('../../package.json').version,
					date: new Date(),
				}, null, (this.readable) ? '\t': '');
		},
		availableFilters() {
			let result = ['*' + this.$t('no subject') + '*'];

			result = result.concat(Object.keys(this.$store.state.subjects));

			return result;
		}
	},
};
</script>
