<template lang="pug">
v-card
	v-toolbar(color="primary")
		v-app-bar-nav-icon
			v-icon help
		v-toolbar-title {{ $t('Help') }}
	v-card-text
		v-container(v-html="text")
</template>

<script>
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

			return mdConverter.makeHtml(text.default);
		}
	}
};
</script>
