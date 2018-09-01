<template lang="pug">
v-container(fluid='')
  v-slide-y-transition(mode='out-in')
    v-layout(column='', align-center='')
      img.mb-5(src='@/assets/logo.png', alt='Vuetify.js')
      blockquote
        | “First, solve the problem. Then, write the code.”
        footer
          small
            em —John Johnson
      blockquote
        | “{{ $t('hello') }}”
        footer
          small
            em —Vue-i18n
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<i18n>
{
  "en-US": {
    "hello": "Hello i18n in SFC!"
  }
}
</i18n>
