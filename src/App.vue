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
    router-view
</template>

<script>
import pkgInfo from '../package.json'
import HelloWorld from './components/HelloWorld';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
  components: {
    HelloWorld,
  },
})
export default class SettingsPage extends Vue {
  drawer = false
  darkMode = false
  appTitle = pkgInfo.displayName + ' ' + pkgInfo.version

  @Watch('$store.state.settings.darkMode')
  darkMode_change(value) {
    this.darkMode = value;
  }

  created() {
    this.dark = this.$store.state.settings.darkMode;
  }
};
</script>
