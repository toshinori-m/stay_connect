<template>
  <div>
    <component :is="HeaderComponent"></component>
    <router-view/>
  </div>
</template>

<script>
import OpenHeader from './components/OpenHeader.vue';

export default ({
  name: 'App',
  components: { OpenHeader },
  computed: {
    HeaderComponent() {
      switch(this.$route.path) {
        case '/':
          return 'OpenHeader';
      }
    }
  }
});
</script>
