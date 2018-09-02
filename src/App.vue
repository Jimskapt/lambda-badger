<template lang="pug">
v-app(:dark="darkMode")
  v-navigation-drawer(persistent, v-model='drawer', fixed, app)
    h1(style="text-align:center;") {{ appTitle }}
    p(style="text-align:center;")
      router-link(to='/') Home
      br
      router-link(to='/about') about
      br
      router-link(to='/settings') {{ $t('Settings') }}
  v-toolbar(app)
    v-toolbar-side-icon(@click.stop='drawer = !drawer')
    v-toolbar-title(v-text='appTitle')
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
      appTitle: pkgInfo.displayName + ' ' + pkgInfo.version,
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