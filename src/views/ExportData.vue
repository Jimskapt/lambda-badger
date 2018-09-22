<template lang="pug">
	div
		v-container
			v-btn(color="secondary", @click="$router.back()")
				v-icon chevron_left
				span {{ $t('Go back') }}
		v-card
			v-toolbar(color="primary")
				v-toolbar-side-icon
					v-icon save
				v-toolbar-title {{ $t('Export your data') }}
			v-card-text
				v-autocomplete(
					v-model="subjectsFilters",
					:items="Object.keys($store.state.subjects)",
					:label="$t('Filter')",
					class="mb-2 mx-1",
					prepend-inner-icon="filter_list",
					v-if="notes !== undefined && notes.length > 0",
					flat, multiple, dense, chips, deletable-chips, small-chips, clearable, hide-no-data, hide-details)
				v-switch(:label="$t('Make it human readable')", v-model="readable")
				v-switch(:label="$t('Include confidential notes')", v-model="confidentials")
				v-alert(type="info", :value="true") {{ $t('In order to save your data, just copy and paste the following data in an text editor (like notepad), and then save it as *.json file.') }}
				v-divider(class="my-3")
				v-textarea(:label="$t('Your data')", readonly, hide-details, v-model="dbData")
</template>

<script>
export default {
	name: 'export-data',
	data() {
		return {
			readable: true,
			confidentials: true,
			subjectsFilters: [],
		};
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

				const confidentialFilter = function() {
					return !(that.confidentials === false && note.confidential === true);
				}

				const subjectFilter = function() {
					let result = false;

					if(that.subjectsFilters.length > 0 && typeof(note.subjects) !== 'undefined') {
						for (let i = 0; i < note.subjects.length; i++) {
							if(that.subjectsFilters.includes(note.subjects[i])) {
								result = true;
								break;
							}
						}
					} else {
						result = true;
					}

					return result;
				}

				return confidentialFilter() && subjectFilter();
			});
		},
		dbData() {
			return JSON.stringify(this.filtered_notes, null, (this.readable) ? '\t': '');
		},
	},
};
</script>
