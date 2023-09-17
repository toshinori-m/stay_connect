<template>
  <div class="flex items-center justify-center mt-20 md:mt-32">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">ログイン</h2>
      <div class="text-center my-10">
        <form class= "w-64 my-5 mx-auto" @submit.prevent="login">
          <p class="text-lg mt-2">メールアドレス</p>
          <input class="w-full py-3 px-5 my-2 border-2 border-gray-200 box-border" type="email" required placeholder="メールアドレス" v-model="email">
          <p class="text-lg mt-2">パスワード</p>
          <input class="w-full py-3 px-5 my-2 border-2 border-gray-200 box-border" type="password" required placeholder="パスワード" v-model="password">
          <div class="error">{{ error }}</div>
          <button class="signup_button">ログイン</button>
        </form>
        <form @submit.prevent="redirectToSignup">
          <button class="text-blue-600 bg-clip-padding p-1 border-4 border-violet-300 border-dashed">アカウントをお持ちでない方はこちら</button>
        </form>
        <form @submit.prevent="redirectToSendEmail">
          <button class="text-blue-600 mt-2 mb-8">パスワードをお忘れの方はこちら</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login() {
      try {
        this.error = null
        const res = await axios.post('http://localhost:3001/auth/sign_in', {
          email: this.email,
          password: this.password
        })
        if (!this.error) {
          this.$router.push({ name: 'HomePage' })
        }
        console.log({ res })
        return res
      } catch (error) {
        console.log({ error })
        this.error = 'メールアドレスかパスワードが違います'
      }
    },
    redirectToSignup () {
      this.$router.push({name: 'SignupPage'})
    },
    redirectToSendEmail () {
      this.$router.push({name: 'SendEmailPage'})
    }
  }
}
</script>
