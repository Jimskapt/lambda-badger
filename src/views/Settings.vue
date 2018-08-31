<template lang="pug">
div
  v-container
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

<script type="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

const TRANSLATED_DESCRIPTION = 'translated_description';
const ENGLISH_LOCALE_DESCRIPTION = 'english_locale_description';

const fallbackLocale = {
  value: 'en-US',
  translated: 'English (US)',
  english: 'English (US)',
};

@Component
export default class SettingsPage extends Vue {
  locale = fallbackLocale;
  dark = false;
  couchUrl = '';
  allowAutomaticUpdate = false;

  @Watch('$store.state.settings.darkMode')
  store_darkMode_change(value) {
    this.dark = value;
  }

  @Watch('$store.state.settings.couchUrl')
  store_couchUrl_change(value) {
    this.couchUrl = value;
  }

  @Watch('$store.state.settings.allowAutomaticUpdate')
  store_allowAutomaticUpdate_change(value) {
    this.allowAutomaticUpdate = value;
  }

  @Watch('available_locales')
  available_locales_change(value) {
    if (typeof(value) === 'undefined') {
      this.locale = fallbackLocale;
    } else {
      const target = value[this.$store.state.settings.locale];
      if (typeof(target) === 'undefined') {
        this.locale = fallbackLocale;
      } else {
        this.locale = target;
      }
    }
  }

  @Watch('$store.state.settings.locale')
  store_locale_change(value) {
    if (typeof(value) === 'undefined') {
      this.locale = fallbackLocale;
    } else {
      const target = this.available_locales[value];
      if (typeof(target) === 'undefined') {
        this.locale = fallbackLocale;
      } else {
        this.locale = target;
      }
    }
  }

  get available_locales() {
    const result = {};

    if (typeof(this.$i18n) !== 'undefined' && typeof(this.$i18n.messages) !== 'undefined') {
      Object.keys(this.$i18n.messages).forEach((m) => {
        const item = {
            value: m,
        };
        item.translated = this.$i18n.messages[m][TRANSLATED_DESCRIPTION];
        item.english = this.$i18n.messages[m][ENGLISH_LOCALE_DESCRIPTION];
        Vue.set(result, m, item);
      });
    }

    return result;
  }

  get available_locales_array() {
    return Object.values(this.available_locales);
  }

  forceRefresh() {
    location.reload();
  }

  save() {
    if (typeof(this.locale) !== 'undefined' && typeof(this.locale.value) !== 'undefined') {
      this.$store.commit('setLocale', {value: this.locale.value});
    }

    this.$store.commit('setDarkMode', {value: this.dark});
    this.$store.commit('setCouchURL', {value: this.couchUrl});
    this.$store.commit('setAllowAutomaticUpdate', {value: this.allowAutomaticUpdate});
  }

  created() {
    this.locale = this.$store.state.settings.locale;
    this.dark = this.$store.state.settings.darkMode;
    this.couchUrl = this.$store.state.settings.couchUrl;
    this.allowAutomaticUpdate = this.$store.state.settings.allowAutomaticUpdate;
  }
}
</script>