<template lang="pug">
div
	h2 Notes
	v-alert(type="info", :value="notes.length <= 0")
		span {{ $t('There is no notes') }}.
		br
		router-link(:to="{name: 'edit-note', params: {id: 1}}") {{ $t('Create') + ' ' + $t('a note') }}
	v-layout(wrap)
		v-flex(v-for="note in notes", :key="note._id", pa-1, d-flex)
			v-card(hover, :to="{name: 'edit-note', params: {id: note._id}}")
				v-card-text
					pre {{ note.content }}
	v-btn(large, fab, fixed, bottom, right, color="primary", :to="{name: 'edit-note', params: {id: 1}}")
		v-icon add
</template>

<script>
export default {
	name: 'notes',
	computed: {
		notes () {
			return Object.keys(this.$store.state.notes).map((key) => {
				return this.$store.state.notes[key];
			});
		}
	}
}
</script>