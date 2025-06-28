<template>
  <div class="flex items-center justify-center mt-4 md:mt-12">
    <div class="md:w-2/5 rounded-md bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">ユーザー登録</h2>
      <div class="text-center my-5 text-blue-600">
        <form @submit.prevent="redirectToRegister">
          <button class="md:w-3/4 w-64 my-10 text-blue-600 border-4 border-blue-300 border-double px-3 py-2">
            <span className="i-lucide-mail w-5 h-5 float-left"></span>
            <i class="px-3">メールアドレスで登録</i>
          </button>
        </form>
        <button @click="signInWithGoogle" class="md:w-3/4 w-64 my-2 text-blue-600 border-4 border-blue-300 border-double px-3 py-2">
          <span className="i-tabler-brand-google w-5 h-5 float-left"></span>
          <i class="px-3">Googleアカウントで登録</i>
        </button>
        <form @submit.prevent="redirectToLogin">
          <button class="md:w-3/4 w-70 my-10 text-blue-600 bg-clip-padding p-1 border-4 border-violet-300 border-dashed">アカウントをお持ちの方はこちら</button>
        </form>
        <div class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'
import { auth } from "@/plugins/firebase"
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default {
  data () {
    return {
      error: null
    }
  },
  methods: {
    redirectToRegister () {
      this.$router.push({name: 'RegisterPage'})
    },
    redirectToLogin () {
      this.$router.push({name: 'LoginPage'})
    },
    async signInWithGoogle() {
      try {
        const apiClient = getApiClient()
        this.error = null
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        const res = await apiClient.post('/users', {
          user: {
            name: user.displayName,
            email: user.email,
            uid: user.uid
          }
        })
        this.$store.commit('setUser', {
          name: user.displayName,
          email: user.email,
          uid: res.headers['uid'],
          'access-token': res.headers['access-token'],
          client: res.headers['client']
        })
        localStorage.setItem('currentUser', JSON.stringify({
          name: user.displayName,
          email: user.email,
          uid: res.headers['uid'],
          'access-token': res.headers['access-token'],
          client: res.headers['client']
        }))
        this.$router.push({ name: 'HomePage' })
        return res
      } catch (error) {
        if (error.response.data.error) {
          this.error = error.response.data.error;
        }
      }
    }
  }
}
</script>
