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
import { auth } from "@/plugins/firebase"
import { createUserWithEmailAndPassword } from 'firebase/auth'

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
      if (this.password !== this.passwordConfirmation) {
        this.error = "パスワードとパスワード確認が一致していません" 
        return
      }
      try {
        this.error = null
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)
        const user = userCredential.user
        const res = await axios.post('http://localhost:3001/users', {
          user: {
            name: this.name,
            email: user.email,
            uid: user.uid
          }
        })
        this.$store.commit('setUser', {
          name: this.name,
          email: user.email,
          uid: user.uid
        })
        this.$router.push({ name: 'HomePage' })
        return res
      } catch (error) {
        if (error.response && error.response.data) {
          this.error = error.response.data.error || error.response.data
        } else if (error.code === 'auth/email-already-in-use') {
          this.error = 'このメールアドレスは既に使用されています。'
        } else {
          this.error = '登録中にエラーが発生しました。'
        }
      }
    },
    redirectToLogin () {
      this.$router.push({name: 'LoginPage'})
    }
  }
}
</script>
