<template>
  <div v-if="user">
    <p>名前：{{ user.name }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.currentUser;
    },
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    }
  },
  mounted() {
    // mountedフックでのログ出力をここに残す
    console.log("currentUser", this.$store.state.currentUser);
  }
}
</script>
