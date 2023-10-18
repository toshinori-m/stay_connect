<template>
  <div class="flex items-center justify-center mt-56">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">対象年齢作成</h2>
      <form class= "text-center" @submit.prevent="TargetAge">
        <div class="text-center my-10">
          <label class="mx-5" for="age">対象年齢</label>
          <input class="py-3 px-3 w-72 border-2 border-gray-200 box-border" type="text" id="age" required placeholder="対象年齢" v-model="name">
        </div>
        <div class="error text-sm text-red-400">{{ error }}</div>
        <button class="ok_button mb-10 mx-2 md:mx-5">登録</button>
        <button class="update_button mb-5 mx-2 md:mx-5" @click="TargetAgeEdit">編集</button>
        <button class="cancel_button mb-10 mx-2 md:mx-5" @click="TargetAgeCancel">戻る</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      name: "",
      error: null
    }
  },
  methods: {
    async TargetAge() {
      try {
        this.error = null
        await axios.post('http://localhost:3001/target_ages', {
          name: this.name,
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid')
        })
        this.$router.push({ name: 'EventSettingPage' })
      } catch (error) {
        this.error = '対象年齢に誤りがあります。'
      }
    },
    TargetAgeEdit() {
      this.$router.push({name: 'TargetAgeEditPage'})
    },
    TargetAgeCancel() {
      this.$router.push({name: 'EventSettingPage'})
    }
  }
}
</script>
