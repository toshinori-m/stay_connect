<template>
  <div>
    <component :is="headerComponent"></component>
    <router-view/>
  </div>
</template>

<script>
import OpenHeader from './components/OpenHeader.vue';
import LoginHeader from './components/LoginHeader.vue';

export default {
  name: 'App',
  components: { OpenHeader, LoginHeader },
  computed: {
    headerComponent() {
      switch(this.$route.path) {
        case '/':
        case '/password':
        case '/send_email':
          return 'OpenHeader';
        case '/login':
        case '/signup':
        case '/register':
          return 'LoginHeader';
        default:
          return 'OpenHeader'; 
      }
    }
  }
}
</script>

