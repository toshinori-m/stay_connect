<template>
  <div class="flex justify-center mt-20 md:mt-32">
    <div class="md:w-2/5 w-full rounded-md bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">新規ユーザー登録</h2>
      <div class="my-10">
        <div class="w-full md:md:flex md:px-8 items-center">
          <p class="text-lg w-40 md:mx-2 pl-2 tracking-tighter text-sm">名前</p>
          <input class="w-full py-3 px-1.5 my-2 border-2 border-gray-200 box-border" type="text" required placeholder="名前（2文字以上）" v-model="name">
        </div>
        <div class="w-full md:md:flex md:px-8 items-center">
          <p class="text-lg w-40 md:mx-2 pl-2 tracking-tighter text-sm">メールアドレス</p>
          <input class="w-full py-3 px-1.5 my-2 border-2 border-gray-200 box-border" type="email" required placeholder="メールアドレス" v-model="email">
        </div>
        <div class="w-full md:md:flex md:px-8 items-center">
          <p class="text-lg w-40 md:mx-2 pl-2 tracking-tighter text-sm">パスワード</p>
          <input class="w-full py-3 px-1.5 my-2 border-2 border-gray-200 box-border" type="password" required placeholder="パスワード（2文字以上）" v-model="password">
        </div>
        <div class="w-full md:md:flex md:px-8 items-center">
          <p class="text-lg w-40 md:mx-2 pl-2 tracking-tighter text-sm">パスワード<br>（確認用）</p>
          <input class="w-full py-3 px-1.5 my-2 border-2 border-gray-200 box-border" type="password" required placeholder="パスワード（確認用）" v-model="passwordConfirmation">
        </div>
      </div>
      <div class="error">{{ error }}</div>
      <form class= "my-5 text-center" @submit.prevent="signUp">
        <button class="ok_button">登録する</button>
      </form>
      <form class= "my-7 text-center" @submit.prevent="redirectToLogin">
        <button class="text-blue-600 bg-clip-padding p-1 border-4 border-violet-300 border-dashed">アカウントをお持ちの方はこちら</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      error: null
    }
  },
  methods: {
    async signUp() {
      try {
        this.error = null
        const res = await axios.post('http://localhost:3001/auth', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.passwordConfirmation
        })
        if (!this.error) {
          window.localStorage.setItem('access-token', res.headers['access-token'])
          window.localStorage.setItem('client', res.headers.client)
          window.localStorage.setItem('uid', res.headers.uid)
          window.localStorage.setItem('name', res.data.data.name)
          this.$router.push({ name: 'HomePage' })
        }
        return res
      } catch (error) {
        this.error = 'メールアドレスかパスワードが違います'
      }
    },
    redirectToLogin () {
      this.$router.push({name: 'LoginPage'})
    }
  }
}
</script>
