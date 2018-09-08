<template lang="pug">
v-app(:dark="darkMode")
  v-navigation-drawer(persistent, v-model='drawer', fixed, app)
    v-toolbar
      v-toolbar-title {{ appName }}
      v-spacer
      span(class="caption") {{ appVersion }}
    v-list
      v-list-tile(:to="{name: 'notes'}")
        v-list-tile-action
          v-icon event_note
        v-list-tile-content
          v-list-tile-title {{ $t('Notes') }}
      v-list-tile(:to="{name: 'settings'}")
        v-list-tile-action
          v-icon settings
        v-list-tile-content
          v-list-tile-title {{ $t('Settings') }}
      v-divider
      v-list-tile(href="https://github.com/Jimskapt/catullus-proteus", target="_blank")
        v-list-tile-action
          v-icon open_in_new
        v-list-tile-content
          v-list-tile-title {{ $t('Help') }}
  v-toolbar(app)
    v-toolbar-side-icon(@click.stop='drawer = !drawer')
    v-toolbar-title {{ appName }}
    v-spacer
    v-btn(icon, :color="($store.state.settings.currentSync !== null) ? 'success' : 'error'")
      v-icon storage
  v-content
    v-container
      router-view
</template>

<script>
import pkgInfo from '../package.json';

export default {
  name: 'app',
  data() {
    return {
      drawer: false,
      darkMode: false,
      appVersion: pkgInfo.version,
      appName: pkgInfo.displayName,
    };
  },
  created() {
    this.darkMode = this.$store.state.settings.darkMode;

    const that = this;
    this.$store.watch(
      function() { return that.$store.state.settings.darkMode; },
      function(value) { that.darkMode = value; },
    );
  }
}
</script>