<template lang="pug">
v-card
	v-toolbar(dark, color="primary")
		v-btn(icon)
			v-icon help
		v-toolbar-title {{ $t('Help') }}
	v-card-text
		v-container
			div(id="doc", v-html="text")
</template>

<script>
// import text from '../../doc-sources/help-en-US.md';
import Showdown from 'showdown';

const mdConverter = new Showdown.Converter();

export default {
	computed: {
		text() {
			let text = require('../../doc-sources/help-' + this.$i18n.fallbackLocale + '.md');
			try {
				text = require('../../doc-sources/help-' + this.$i18n.locale + '.md');
			} catch(e) {
				console.warn(e, ', fallback to help-' + this.$i18n.fallbackLocale + '.md');
			}

			return mdConverter.makeHtml(text);
		}
	}
};
</script>
