<template>
  <div class="flex items-center justify-center mt-56">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">再設定メール送信</h2>
      <div class="text-center my-10">
        <p class="text-xs my-4 px-2.5">入力していただいたメールアドレス宛に再設定のご案内メールが届きます。</p>
        <label class="mx-5" for="email">メールアドレス</label>
        <input class="py-3 px-3 w-72 border-2 border-gray-200 box-border" type="email" required placeholder="メールアドレス" v-model="email">
      </div>
      <form class= "text-center" @submit.prevent="redirectToSetSendEmail">
        <button class="ok_button mb-10">送信する</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth"

export default {
  data() {
    return {
      email: "",
      error: null
    }
  },
  methods: {
    async redirectToSetSendEmail() {
      try {
        this.error = null
        const auth = getAuth()
        await sendPasswordResetEmail(auth, this.email)
        alert('再設定のご案内メールを送信しました。')
      } catch {
        this.error = 'メール送信に失敗しました。正しいメールアドレスを入力してください。'
      }
    }
  }
}
</script>
