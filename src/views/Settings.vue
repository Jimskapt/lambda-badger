<template lang="pug">
v-card
	v-toolbar(dark, color='primary')
		v-btn(icon)
			v-icon settings
		v-toolbar-title {{ $t("Settings") }}
	v-card-text
		v-container
			v-autocomplete(
				:items='available_locales_array',
				item-text='english',
				item-value='value',
				:hint='`${locale.translated}`',
				v-model='locale',
				:label="$t('Locale') + ' (locale)'",
				prepend-icon='language',
				autocomplete,
				return-object
			)
			v-switch(:label="$t('Use dark colors ?')", v-model="dark")
			v-text-field(
				v-model="couchUrl",
				:label="$t('The url of your CouchDB-like database') + ' (' + $t('optional') + ')'",
				prepend-icon='database'
				clearable
			)
			v-layout
				v-flex(shrink, pr-2)
					v-checkbox(v-model="allowAutomaticUpdate", :label="$t('Update automatically')", v-if="couchUrl.trim() !== ''")
				v-flex(pl-2)
					v-btn(block, v-if="couchUrl.trim() !== '' && !allowAutomaticUpdate")
						v-icon sync
						span {{ $t('Do a manual update') }}
			v-btn(block, color='warning', @click='forceRefresh')
				v-icon refresh
				span {{ $t('Debug : refresh page') }}
		v-card-actions
			v-btn(block, color='error', @click='$router.go(-1)')
				v-icon clear
				span {{ $t("Abort") }}
			v-btn(block, color='success', @click='save')
				v-icon done
				span {{ $t("OK") }}
</template>

<script>
const fallbackLocale = {
	value: 'en-US',
	translated: 'English (US)',
	english: 'English (US)',
}

export default {
	name: 'settings',
	props: ['id'],
	data() {
		return {
			locale: fallbackLocale,
			dark: false,
			couchUrl: '',
			allowAutomaticUpdate: false,
		};
	},
	computed: {
		available_locales() {
			const result = {};

			const that = this;
			if (typeof(this.$i18n) !== 'undefined' && typeof(this.$i18n.messages) !== 'undefined') {
				Object.keys(this.$i18n.messages).forEach((m) => {
					const item = {
							value: m,
					};

					item.translated = this.$i18n.messages[m]['translated_description'];
					item.english = this.$i18n.messages[m]['english_locale_description'];
					that.$set(result, m, item);
				});
			}

			return result;
		},
		available_locales_array() {
			return Object.values(this.available_locales);
		},
	},
	watch: {
		'$store.state.settings.locale': function() {
			this.locale = this.$store.state.settings.locale;
		},
		'$store.state.settings.darkMode': function() {
			this.dark = this.$store.state.settings.darkMode;
		},
		'$store.state.settings.couchUrl': function() {
			this.couchUrl = this.$store.state.settings.couchUrl;
		},
		'$store.state.settings.allowAutomaticUpdate': function() {
			this.allowAutomaticUpdate = this.$store.state.settings.allowAutomaticUpdate;
		},
	},
	methods: {
		forceRefresh() {
			location.reload();
		},
		save() {
			if (typeof(this.locale) !== 'undefined' && typeof(this.locale.value) !== 'undefined') {
				this.$store.commit('setLocale', {value: this.locale.value});
			}

			this.$store.commit('setDarkMode', {value: this.dark});
			this.$store.commit('setCouchURL', {value: this.couchUrl});
			this.$store.commit('setAllowAutomaticUpdate', {value: this.allowAutomaticUpdate});
		},
	},
	created() {
		this.locale = this.$store.state.settings.locale;
		this.dark = this.$store.state.settings.darkMode;
		this.couchUrl = this.$store.state.settings.couchUrl;
		this.allowAutomaticUpdate = this.$store.state.settings.allowAutomaticUpdate;
	},
}
</script>