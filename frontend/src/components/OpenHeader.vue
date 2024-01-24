<template>
  <div>
    <div class="z-40 fixed top-0 bg-sky-200 p-5 w-full h-41 md:pl-32 md:h-16 md:text-left">
      <div class="flex justify-center md:justify-start">
        <div class="float-left">
          <MouseCharacter />
        </div>
        <div class="font-bold text-3xl text-blue-600 md:-mt-1">stay_connect</div>
      </div>
      <div class="flex flex-col mt-3 md:-mt-10 md:flex-row justify-center md:justify-end items-center">
        <form class="mb-2 md:mb-0 md:mr-4" @submit.prevent="redirectToSignup">
          <button class="ok_button">無料登録</button>
        </form>
        <form @submit.prevent="redirectToLogin">
          <button class="login_button">ログイン</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import MouseCharacter from './MouseCharacter.vue'

export default {
  components: {
    MouseCharacter
  },
  methods: {
    redirectToSignup () {
      this.$router.push({name: 'SignupPage'})
    },
    redirectToLogin () {
      this.$router.push({name: 'LoginPage'})
    }
  }
}
</script>
