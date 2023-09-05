<template>
  <div>
    <component :is="headerComponent"></component>
    <router-view/>
  </div>
</template>

<script>
import OpenHeader from './components/OpenHeader.vue';

export default ({
  name: 'App',
  components: { OpenHeader },
  computed: {
    headerComponent() {
      switch(this.$route.path) {
        case '/':
          return 'OpenHeader';
      }
    }
  }
});
</script>
