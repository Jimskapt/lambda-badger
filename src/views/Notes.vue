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
	v-layout(wrap)
		v-flex(v-for="note in notes", :key="note._id", pa-1, d-flex)
			v-card(hover, :to="{name: 'edit-note', params: {id: note._id}}")
				v-card-text
					pre {{ note.content }}
	v-btn(large, icon, fixed, bottom, right, color="primary", :to="{name: 'edit-note', params: {id: 1}}")
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
		},
	},
};
</script>