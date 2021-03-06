<template lang="pug">
	div
		v-container
			v-btn(color="secondary", @click="$router.back()")
				v-icon chevron_left
				span {{ $t('Go back') }}
		v-card
			v-toolbar(color="primary")
				v-app-bar-nav-icon
					v-icon {{ (exists) ? 'edit' : 'add' }}
				v-toolbar-title {{ (exists) ? $t('Edit the note') : $t('Create a note') }}
			v-card-text
				v-text-field(:label="$t('Title')", v-model="dbDoc.title")
				rich-editor(v-model="dbDoc.content", :label="$t('Content')")
				v-combobox(
					chips,
					deletable-chips,
					small-chips,
					multiple,
					:items="Object.keys($store.state.subjects)"
					:label="$t('Subjects')",
					v-model="dbDoc.subjects",
					item-text="name",
					item-value="name")
				template(v-slot:activator="{ on }")
					v-tooltip(bottom, v-on="on")
						v-switch(slot="activator", :label="$t('It is confidential')", v-model="dbDoc.confidential")
						span {{ $t('The note will not be displayed by default, you will have to ask to show it') }}.
				v-row
					v-col
						v-btn(block, color="primary", @click="saveNote")
							v-icon {{ (exists) ? 'save' : 'add' }}
							span {{ (exists) ? $t("Save") : $t("Create") }}
					v-col(v-if="exists")
						v-btn(block, color="error", @click="deleteNote")
							v-icon delete
							span {{ $t('Delete this note') }}
</template>

<script>
import RichEditor from '@/components/rich-editor.vue';

export default {
	name: 'edit-note',
	props: ['id'],
	components: {
		'rich-editor': RichEditor,
	},
	data() {
		return {
			dbDoc: {
				content: '',
				data_type: 'note',
			},
			changed: false,
		};
	},
	computed: {
		exists() {
			return this.dbDoc._rev !== undefined;
		},
	},
	watch: {
		dbDoc: {
			handler: function(value, oldValue) {
				if(oldValue._id === value._id && oldValue._rev === value._rev) {
					this.changed = true;
				} else {
					this.changed = false;
				}
			},
			deep: true,
		},
		changed(value) {
			if(value === true) {
				const that = this;
				window.onbeforeunload = function() {
					return that.$t('The note is not saved, you will lost the changes if your are leaving the page. Please confirm the exit.');
				};
			} else {
				window.onbeforeunload = false;
			}
		}
	},
	methods: {
		id_changed(value) {
			const that = this;
			this.$store.dispatch('getNote', {id: value})
				.then((res) => {
					if(res.find) {
						that.$set(this, 'dbDoc', res.doc);
					} else {
						that.$set(this, 'dbDoc', {
							content: '',
							data_type: 'note',
						});
					}
				})
				.catch(() => {
					// no problem if error
					that.$set(this, 'dbDoc', {
						content: '',
						data_type: 'note',
					});
				})
				.finally(() => {
					that.changed = false;
				});
		},
		saveNote() {
			const that = this;
			this.$store.dispatch('setNote', {data: this.dbDoc})
				.then((res) => {
					if(res.ok) {
						if(res.doc !== undefined) {
							that.$set(that, 'dbDoc', res.doc);
						} else {
							that.$toasted.show('Error while fetching saving note', { duration: 4000, type: 'error', icon: 'warning' });
						}
					} else {
						that.$toasted.show('Error while saving note', { duration: 4000, type: 'error', icon: 'warning' });
					}

					that.changed = false;

					this.$store.dispatch('fetchAllSubjects')
						.catch((err) => {
							console.error('CPE0017: ', err);
						});
				})
				.catch((err) => {
					that.$toasted.show(err, { duration: 4000, type: 'error', icon: 'warning' });
				});
		},
		deleteNote() {
			const that = this;
			this.$store.dispatch('deleteNote', {data: this.dbDoc})
				.then((res) => {
					if(res.ok) {
						that.$router.push({ name: 'notes' });
					} else {
						that.$toasted.show('Error while deleting document', { duration: 4000, type: 'error', icon: 'warning' });
					}
				})
				.catch((err) => {
					that.$toasted.show(err, { duration: 4000, type: 'error', icon: 'warning' });
				});
		}
	},
	created() {
		this.id_changed(this.id);

		const that = this;
		this.$store.dispatch('getNote', {id: this.id})
			.then((res) => {
				if(res.find) {
					that.$set(this, 'dbDoc', res.doc);
				} else {
					that.$set(this, 'dbDoc', {
						content: '',
						data_type: 'note',
					});
				}
			})
			.catch(() => {
				// no problem if error
				that.$set(this, 'dbDoc', {
					content: '',
					data_type: 'note',
				});
			});
		
		this.$store.watch(
			function() { return that.id },
			function(value) { that.id_changed(value) },
		);
	},
	beforeDestroy() {
		window.onbeforeunload = null;
	},
	beforeRouteLeave(to, from, next) {
		if(this.changed) {
			if(confirm(this.$t('The note is not saved, you will lost the changes if your are leaving the page. Please confirm the exit.'))) {
				next();
			} else {
				next(false);
			}
		} else {
			next();
		}
	}
};
</script>
