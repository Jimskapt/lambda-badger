<template lang="pug">
div
  v-container
    v-card
      v-toolbar(dark, color='primary')
        v-btn(icon)
          v-icon settings
        v-toolbar-title {{ $t("Settings") }}
      v-container
        v-autocomplete( :items='available_locales_array',
                        item-text='english',
                        item-value='value',
                        :hint='`${locale.translated}`',
                        v-model='locale',
                        :label="$t('Locale') + ' (locale)'",
                        prepend-icon='language',
                        autocomplete,
                        return-object)
        v-switch(:label="$t('Use dark colors ?')", v-model="dark")
        v-btn(dark, block, color='warning', @click='forceRefresh')
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
  @Watch('$store.state.settings.darkMode')
  darkMode_change(value) {
    this.dark = value;
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
  }

  created() {
    this.locale = this.$store.state.settings.locale;
    this.dark = this.$store.state.settings.darkMode;
  }
}
</script>