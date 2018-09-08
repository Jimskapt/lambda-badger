<template lang="pug">
	div
		v-container
			v-btn(color="secondary", @click="$router.back()")
				v-icon chevron_left
				span {{ $t('Go back') }}
		v-card
			v-toolbar(color="primary")
				v-toolbar-side-icon
					v-icon {{ (exists) ? 'edit' : 'add' }}
				v-toolbar-title {{ (exists) ? $t('Edit the note') : $t('Create a note') }}
			v-card-text
				v-textarea(:label="$t('Content')", v-model="dbDoc.content")
				v-layout(column, mt-2)
					v-flex
						v-btn(large, block, color="primary", @click="save")
							v-icon {{ (exists) ? 'save' : 'add' }}
							span {{ (exists) ? $t("Save") : $t("Create") }}
</template>

<script>
export default {
	name: 'edit-note',
	props: ['id'],
	data() {
		return {
			dbDoc: {
				content: '',
				data_type: 'note',
			},
		};
	},
	computed: {
		exists() {
			return typeof(this.dbDoc._rev) !== 'undefined';
		},
	},
	methods: {
		id_changed(value) {
			const that = this;
			this.$store.dispatch('getNote', {id: value})
				.then((res) => {
					if (res.find) {
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
		},
		save() {
			const that = this;
			this.$store.dispatch('setNote', {data: this.dbDoc})
				.then((res) => {
					if (res.ok) {
						if (typeof(res.doc) !== 'undefined') {
							that.$set(this, 'dbDoc', res.doc);
						} else {
							console.error('CPE0003', res);
						}
					} else {
						console.error('CPE0001:', res);
						// TODO
					}
				})
				.catch((err) => { console.error('CPE0002:', err); }); // TODO
		},
	},
	created() {
		this.id_changed(this.id);

		const that = this;
		this.$store.dispatch('getNote', {id: this.id})
			.then((res) => {
				if (res.find) {
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
};
</script>
