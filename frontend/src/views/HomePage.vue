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
      return this.$store.getters.isUserLoggedIn
    },
    apiClientUid() {
      return this.$store.state.apiClientUid
    }
  },
  mounted() {
    // const user = localStorage.getItem('currentUser')
    // const uid = user ? JSON.parse(user).uid : null
    // console.log("uid",uid)
    // if (uid === null) {
    //   window.location.reload();
    // }
    if (!sessionStorage.getItem('reloaded')) {
      // リロード状態をセット
      sessionStorage.setItem('reloaded', 'true');
      // ページをリロード
      window.location.reload();
    } else {
      // リロードが既に行われていた場合、リロード状態を削除
      sessionStorage.removeItem('reloaded');
    }
  }
}
</script>
