<template>
  <div class="flex items-center justify-center mt-56">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">都道府県名作成</h2>
      <form class= "text-center" @submit.prevent="prefecture">
        <div class="text-center my-10">
          <label class="mx-5" for="type">都道府県名</label>
          <input class="py-3 px-3 w-72 border-2 border-gray-200 box-border" type="text" id="type" required placeholder="都道府県名" v-model="name">
        </div>
        <div class="error text-sm text-red-400">{{ error }}</div>
        <button class="ok_button mb-10 mx-2 md:mx-5">登録</button>
        <button class="update_button mb-5 mx-2 md:mx-5" @click="prefectureEdit">編集</button>
        <button class="cancel_button mb-10 mx-2 md:mx-5" @click="prefectureCancel">戻る</button>
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
    async prefecture() {
      try {
        this.error = null
        await axios.post('http://localhost:3001/prefectures', {
          name: this.name,
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid')
        })
        this.$router.push({ name: 'EventSettingPage' })
      } catch (error) {
        this.error = '都道府県名に誤りがあります。'
      }
    },
    prefectureEdit() {
      this.$router.push({name: 'PrefectureEditPage'})
    },
    prefectureCancel() {
      this.$router.push({name: 'EventSettingPage'})
    }
  }
}
</script>
