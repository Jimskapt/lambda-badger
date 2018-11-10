import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};

  locales.keys().forEach(key => {
    const matched = key.match(/([a-z0-9-]+)\./i);

    if(matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });

  return messages;
}

let default_locale = 'en-US';
if(navigator.language === 'fr') {
  default_locale = 'fr-FR';
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || default_locale,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en-US',
  messages: loadLocaleMessages(),
});
