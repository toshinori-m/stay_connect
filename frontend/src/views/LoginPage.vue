<template>
  <div class="flex items-center justify-center mt-4 md:mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">ログイン</h2>
      <div class="text-center my-10">
        <form class= "w-64 my-5 mx-auto" @submit.prevent="login">
          <p class="text-lg mt-2">メールアドレス</p>
          <input class="w-full py-3 px-5 my-2 border-2 border-gray-200 box-border" type="email" required placeholder="メールアドレス" v-model="email">
          <p class="text-lg mt-2">パスワード</p>
          <input class="w-full py-3 px-5 my-2 border-2 border-gray-200 box-border" type="password" required placeholder="パスワード" v-model="password">
          <div class="error text-sm text-red-400">{{ error }}</div>
          <button class="ok_button">ログイン</button>
        </form>
        <button @click="signInWithGoogle" class="md:w-3/4 mt-6 mb-8 text-blue-600 border-4 border-blue-300 border-double px-3 py-2">
          <span className="i-tabler-brand-google w-5 h-5 float-left"></span>
          <i class="px-3 text-base">Googleアカウントでログイン</i>
        </button>
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
import { auth } from "@/plugins/firebase"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

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
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password)
        const user = userCredential.user
        this.$store.commit('setUser', {
          email: user.email,
          uid: user.uid
        })
        this.$router.push({ name: 'HomePage' })
        return res
      } catch {
        this.error = 'メールアドレスかパスワードが違います'
      }
    },
    async signInWithGoogle() {
      try {
        this.error = null
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        this.$store.commit('setUser', {
          name: user.displayName,
          email: user.email,
          uid: user.uid
        })
        this.$router.push({ name: 'HomePage' })
      } catch {
        this.error = "ユーザー登録からGoogleアカウントで登録して下さい"
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
