<template lang="pug">
v-card
	v-toolbar(:color="(is_archive === true) ? 'secondary' : 'primary'", dense)
		v-toolbar-title {{ title }}
		v-spacer
		v-tooltip(bottom)
			template(v-slot:activator="{ on }")
				v-btn(small, icon, @click="$store.dispatch('toggleArchive', {_id: id})", slot="activator", v-on="on")
					v-icon(v-if="is_archive") inbox
					v-icon(v-else) move_to_inbox
			span(v-if="is_archive") {{ $t('Unarchive this note') }}
			span(v-else) {{ $t('Archive this note') }}
		v-tooltip(bottom, v-if="confidential === true")
			template(v-slot:activator="{ on }")
				v-btn(small, icon, @click="show_content = !show_content", slot="activator", v-on="on")
					v-icon(v-if="show_content") visibility_off
					v-icon(v-else) visibility
			span(v-if="show_content") {{ $t('Hide the content of the note') }}
			span(v-else) {{ $t('Show the content of the note') }}
		v-tooltip(bottom)
			template(v-slot:activator="{ on }")
				v-btn(small, icon, :to="{name: 'edit-note', params: {id: id}}", slot="activator", v-on="on")
					v-icon edit
			span {{ $t('Edit the note') }}
	v-card-text
		div(v-if="confidential !== true || show_content", style="overflow:auto;", v-html="htmlContent")
		i(v-else) [{{ $t('confidential') }}]
		div(v-if="subjects !== undefined", class="text-xs-right")
			v-divider(style="margin: 0.5em 0px;")
			template(v-for="subject in subjects")
				v-chip(small, outlined) {{ subject }}
</template>

<script>
import markdownIt from 'markdown-it';
import markdownItCheckboxes from 'markdown-it-checkbox';

const markdownConverter = markdownIt().use(markdownItCheckboxes);

export default {
	name: 'note-display',
	props: ['id', 'title', 'content', 'confidential', 'subjects', 'is_archive'],
	data() {
		return {
			show_content: false,
		};
	},
	computed: {
		htmlContent() {
			return markdownConverter.render(this.content);
		},
	},
};
</script>

