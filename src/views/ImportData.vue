<template lang="pug">
div
	v-container
		v-btn(color="secondary", @click="$router.back()")
			v-icon chevron_left
			span {{ $t('Go back') }}
	v-card
		v-toolbar(color="primary")
			v-toolbar-side-icon
				v-icon unarchive
			v-toolbar-title {{ $t('Import your data') }}
		v-card-text
			v-alert(type="info", :value="true") {{ $t('Please paste your data in the following field and click on the button in the the bottom of the page, in order to load them in this app.') }}
			v-divider(class="my-3")
			v-textarea(:label="$t('Your data')", hide-details, v-model="userData")
		v-card-actions
			v-btn(large, block, color="primary", @click="load", :disabled="userData.trim() === ''", :loading="loading")
				v-icon unarchive
				span {{ $t('Import your data') }}
</template>

<script>
export default {
	name: 'export-data',
	data() {
		return {
			userData: '',
			loading: false
		};
	},
	methods: {
		load() {
			if( this.userData.trim() !== '') {
				this.loading = true;

				try {
					const data = JSON.parse(this.userData);

					if(typeof(data.notes) !== 'undefined') {
						if(typeof(data.notes.items) !== 'undefined') {

							let promises = [];
							data.notes.items.forEach((note) => {
								let payload = {data: note};

								if(typeof(this.$store.state.notes[note._id]) !== 'undefined') {
									this.$set(payload.data, '_rev', this.$store.state.notes[note._id]._rev);
								} else {
									this.$delete(payload.data, '_rev');
								}

								promises.push(this.$store.dispatch('setNote', payload));
							});

							Promise.all(promises)
								.catch((err) => {
									this.$toasted.show(err, { duration: 4000, type: 'error', icon: 'warning' });
								})
								.finally(() => {
									this.loading = false;
								});
						}
					}
				} catch(e) {
					alert('Error while parsing your data :\n' + e);

					this.loading = false;
				}
			}
		}
	}
};
</script>
