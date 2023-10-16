<template>
  <div>
    <component :is="headerComponent"></component>
    <router-view/>
  </div>
</template>

<script>
import OpenHeader from './components/OpenHeader.vue';
import LoginHeader from './components/LoginHeader.vue';
import HomeHeader from './components/HomeHeader.vue';

export default {
  name: 'App',
  components: { OpenHeader, LoginHeader, HomeHeader },
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
        case '/home':
        case '/event_setting':
          return 'HomeHeader';
        default:
          return 'HomeHeader'; 
      }
    }
  }
}
</script>
