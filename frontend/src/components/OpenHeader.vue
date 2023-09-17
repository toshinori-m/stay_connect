<template>
  <div>
    <div class="text-center z-40 fixed top-0 bg-sky-200 p-5 w-full h-41 md:pl-32 md:h-16  md:text-left">
      <form @submit.prevent="redirectToOpen">
        <button class="font-bold text-3xl text-blue-600 md:-mt-1">stay_connect</button>
      </form>
      <div class="mt-2 md:text-right md:-mt-11 md:mr-28">
        <form @submit.prevent="redirectToSignup">
          <button class="signup_button">無料登録</button>
        </form>
      </div>
      <div class="mt-2 md:text-right md:-mt-10 md:mr-60">
        <form @submit.prevent="redirectToLogin">
          <button class="login_button">ログイン</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToOpen () {
      this.$router.push({name: 'OpenPage'})
    },
    redirectToSignup () {
      this.$router.push({name: 'SignupPage'})
    },
    redirectToLogin () {
      this.$router.push({name: 'LoginPage'})
    }
  }
}
</script>
