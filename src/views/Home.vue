<template>
  <div class="home">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
