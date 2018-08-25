<template lang="pug">
v-app(:dark="darkMode")
  v-navigation-drawer(persistent='', :mini-variant='miniVariant', :clipped='clipped', v-model='drawer', enable-resize-watcher='', fixed='', app='')
    v-list
      v-list-tile(value='true', v-for='(item, i) in items', :key='i')
        v-list-tile-action
          v-icon(v-html='item.icon')
        v-list-tile-content
          v-list-tile-title(v-text='item.title')
  v-toolbar(app='', :clipped-left='clipped')
    v-toolbar-side-icon(@click.stop='drawer = !drawer')
    v-btn(icon='', @click.stop='miniVariant = !miniVariant')
      v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
    v-btn(icon='', @click.stop='clipped = !clipped')
      v-icon web
    v-btn(icon='', @click.stop='fixed = !fixed')
      v-icon remove
    v-toolbar-title(v-text='title')
    v-spacer
    v-btn(icon='', @click.stop='rightDrawer = !rightDrawer')
      v-icon menu
  v-content
    v-container
      p(style="text-align:center;")
        router-link(to='/') Home
        span &nbsp;|&nbsp;
        router-link(to='/about') About
        span &nbsp;|&nbsp;
        router-link(to='/settings') {{ $t('Settings') }}
    router-view
  v-navigation-drawer(temporary='', :right='right', v-model='rightDrawer', fixed='', app='')
    v-list
      v-list-tile(@click='right = !right')
        v-list-tile-action
          v-icon compare_arrows
        v-list-tile-title Switch drawer (click me)
  v-footer(:fixed='fixed', app='')
    span Catullus-Proteus project, 2018
</template>

<script>
import HelloWorld from './components/HelloWorld';
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
  components: {
    HelloWorld,
  },
})
export default class SettingsPage extends Vue {
  darkMode = false

  @Watch('$store.state.settings.darkMode')
  darkMode_change(value) {
    this.darkMode = value;
  }

  created() {
    this.dark = this.$store.state.settings.darkMode;
  }
};
</script>
