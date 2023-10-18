<template>
  <div class="flex items-center justify-center mt-56">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">パスワード再設定</h2>
      <div class="text-center my-10">
        <label class="mx-5" for="password">新しいパスワード</label>
        <input class="py-3 px-3 w-72 border-2 border-gray-200 box-border" type="password" required placeholder="新しいパスワード" v-model="password">
      </div>
      <div class="text-center my-10">
        <label class="mx-5" for="password_confirmation">パスワード再入力</label>
        <input class="py-3 px-3 w-72 border-2 border-gray-200 box-border" type="password" required placeholder="パスワード再入力" v-model="password_confirmation" >
      </div>
      <form class= "text-center" @submit.prevent="redirectToSetPassword">
        <button class="ok_button mb-10">再設定</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      password: "",
      password_confirmation: "",
      error: null
    }
  },
  methods: {
    async SetPassword() {
      try {
        this.error = null
        const res = await axios.post('http://localhost:3001/application', {
          password: this.password,
          password_confirmation: this.password_confirmation
        })
        this.$router.push({ name: 'HomePage' })
        return res
      } catch (error) {
        this.error = 'パスワードが違います'
      }
    }
  }
}
</script>
