<template>
  <div class="flex justify-center mt-4 md:mt-12">
    <div class="md:w-2/5 w-full rounded-md bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">新規ユーザー登録</h2>
      <div class="my-10">
        <div class="w-full md:md:flex md:px-8 items-center">
          <p class="text-lg w-40 md:-ml-3 pl-2 tracking-tighter text-sm">名前</p>
          <input class="w-full py-3 px-1.5 my-2 border-2 border-gray-200 box-border" type="text" required placeholder="名前（2文字〜100文字）" v-model="name">
        </div>
        <div v-if="remainingCharactersRegistertName <= 5" class="text-red-500">
          名前はあと{{ remainingCharactersRegistertName }}文字までです。
        </div>
        <div class="w-full md:md:flex md:px-8 items-center">
          <p class="text-lg w-40 md:-ml-3 pl-2 tracking-tighter text-sm">メールアドレス</p>
          <input class="w-full py-3 px-1.5 my-2 border-2 border-gray-200 box-border" type="email" required placeholder="メールアドレス" v-model="email">
        </div>
        <div class="w-full md:md:flex md:px-8 items-center">
          <p class="text-lg w-40 md:-ml-3 pl-2 tracking-tighter text-sm">
            <span class="md:inline-block inline tracking-tighter text-sm">パスワード</span>
            <span class="md:hidden"> </span>
            <span class="md:inline-block inline tracking-tighter text-sm">( 6文字〜100文字 )</span>
          </p>
          <input class="w-full py-3 px-1.5 my-2 border-2 border-gray-200 box-border" type="password" required placeholder="パスワード（6文字〜100文字）" v-model="password">
        </div>
        <div class="w-full md:md:flex md:px-8 items-center">
          <p class="text-lg w-40 md:-ml-3 pl-2 tracking-tighter text-sm">
            <span class="md:inline-block inline tracking-tighter text-sm">パスワード</span>
            <span class="md:hidden"> </span>
            <span class="md:inline-block inline tracking-tighter text-sm">（確認用）</span>
          </p>
          <input class="w-full py-3 px-1.5 my-2 border-2 border-gray-200 box-border" type="password" required placeholder="パスワード（確認用）" v-model="passwordConfirmation">
        </div>
      </div>
      <div class="error" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
      <div class="error text-sm">{{ error }}</div>
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
import getApiClient from '@/lib/apiClient'
import { auth } from "@/plugins/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { deleteUser } from "firebase/auth"

export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      error: '',
      errors: []
    }
  },
  computed: {
    remainingCharactersRegistertName() {
      const maxChars = 100
      const nameLength = this.name.length
      return maxChars - nameLength
    }
  },
  methods: {
    async signUp() {
      let user = null
      if (this.password !== this.passwordConfirmation) {
        this.error = "パスワードとパスワード確認が一致していません" 
        return
      }
      try {
        this.error = ''
        this.errors = []
        const apiClient = getApiClient()
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)
        user = userCredential.user
        const res = await apiClient.post('/users', {
          user: {
            name: this.name,
            email: user.email,
            uid: user.uid
          }
        })
        this.$store.commit('setUser', {
          name: this.name,
          email: user.email,
          uid: res.headers['uid'],
          'access-token': res.headers['access-token'],
          client: res.headers['client']
        })
        this.$router.push({ name: 'HomePage' })
        return res
      } catch (error) {
        const firebaseErrorCodes = {
          'auth/invalid-email': 'メールアドレスの形式が不正です。',
          'auth/weak-password': 'パスワードは6文字以上が必要です。',
          'auth/email-already-in-use': 'このメールアドレスは既に使用されています。'
        }
        const errorCode = error.code
        this.error = firebaseErrorCodes[errorCode] || "firebase登録中にエラーが発生しました。"
        this.errors = error.response?.data?.errors ? error.response.data.errors : ["データベース登録中にエラーが発生しました。"]
        if (user) {
          try {
            await deleteUser(user)
          } catch (deleteError) {
            this.errors = ["Firebaseユーザーの削除に失敗しました。"]
          }
        }
      }
    },
    redirectToLogin () {
      this.$router.push({name: 'LoginPage'})
    }
  }
}
</script>
