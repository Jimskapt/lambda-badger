<template lang="pug">
v-app
  v-navigation-drawer(persistent, v-model="drawer", fixed, app)
    v-app-bar
      v-toolbar-title {{ appName }}
      v-spacer
      span(class="caption") {{ appVersion }}
    v-list
      v-list-item(:to="{name: 'notes'}")
        v-list-item-action
          v-icon event_note
        v-list-item-content
          v-list-item-title {{ $t('Notes') }}
      v-list-item(:to="{name: 'settings'}")
        v-list-item-action
          v-icon settings
        v-list-item-content
          v-list-item-title {{ $t('Settings') }}
      v-list-item(:to="{name: 'help'}")
        v-list-item-action
          v-icon help
        v-list-item-content
          v-list-item-title {{ $t('Help') }}
      v-divider
      v-list-item(:href="appWebsite", target="_blank", v-if="appWebsite !== '<package.json:website>'")
        v-list-item-action
          v-icon bookmarks
        v-list-item-content
          v-list-item-title {{ $t('Website') }}
      v-list-item(v-else)
        v-list-item-content package.json:website
  v-app-bar(app)
    v-app-bar-nav-icon(@click.stop="drawer = !drawer")
    v-toolbar-title {{ appName }}
    v-spacer
    v-btn(icon, :color="($store.state.settings.currentSync !== null) ? 'success' : 'error'", :to="{name: 'settings'}")
      v-icon storage
  v-main
    v-container
      router-view
</template>

<script>
import pkgInfo from '../package.json';

export default {
  name: 'App',
  data() {
    return {
      drawer: false,
      appVersion: pkgInfo.version || '<package.json:version>',
      appName: pkgInfo.displayName || '<package.json:displayName>',
      appWebsite: pkgInfo.website || '<package.json:website>',
    };
  },
  created() {
    const that = this;

    that.$vuetify.theme.dark = that.$store.state.settings.darkMode || false;

    this.$store.watch(
      function() { return that.$store.state.settings.darkMode; },
      function(value) { that.$vuetify.theme.dark = value; },
    );
  }
}
</script>