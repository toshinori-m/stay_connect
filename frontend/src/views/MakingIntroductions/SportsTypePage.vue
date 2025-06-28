<template>
  <div class="flex items-center justify-center mt-56">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">競技名</h2>
      <form class= "text-center" @submit.prevent="sportType">
        <div class="text-center my-10">
          <label class="mx-5" for="type">競技名</label>
          <input class="py-3 px-3 w-72 border-2 border-gray-200 box-border" type="text" id="type" required placeholder="競技名" v-model="name">
        </div>
        <div class="error text-sm text-red-400">{{ error }}</div>
        <button class="ok_button mb-10 mx-2 md:mx-5">登録</button>
        <button class="update_button mb-5 mx-2 md:mx-5" @click="sportTypeEdit">編集</button>
        <button class="cancel_button mb-10 mx-2 md:mx-5" @click="sportTypeCancel">戻る</button>
      </form>
    </div>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      name: "",
      error: null
    }
  },
  methods: {
    async sportType() {
      try {
        const apiClient = getApiClient()
        this.error = null
        await apiClient.post('/sports_types', {
          name: this.name
        }, {
          withCredentials: true
        })
        this.$router.push({ name: 'EventSettingPage' })
      } catch {
        this.error = '競技名に誤りがあります。'
      }
    },
    sportTypeEdit() {
      this.$router.push({name: 'SportsTypeEditPage'})
    },
    sportTypeCancel() {
      this.$router.push({name: 'EventSettingPage'})
    }
  }
}
</script>
