<template>
  <div class="flex items-center justify-center mt-32 xl:mt-20">
    <div class="xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">基本設定編集</h2>
      <button class="cancel_button mx-5 float-right" @click="EventSettingEditCancel">戻る</button>
      <div class="my-10">
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
        <form class= "text-center" @submit.prevent="editEventSetting(users.id)">
          <ul>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 xl:mr-4 xl:ml-3" for="name">name</label>
              <input class="xl:place-self-center mx-6 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="name" type="text" required placeholder="イベント名" v-model="users.name">
            </li>
            <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
            <button class="update_button mx-5">更新</button>
          </ul>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      users: {},
      errors: [],
      backend_errors: ""
    }
  },
  methods: {
    async getBasicSettingEdit() {
      try {
        this.errors = []
        const res = await axios.get('http://localhost:3001/auth/users', {
          headers: {
          uid: window.localStorage.getItem('uid'),
          "access-token": window.localStorage.getItem('access-token'),
          client: window.localStorage.getItem('client')
          }
        })
        console.log({ res })
        this.users = res.data.data
      } catch (error) {
        this.errors.push('基本設定を表示出来ませんでした。')
      }
    },
    EventSettingEditCancel() {
      this.$router.push({name: 'HomePage'})
    }
  },
  mounted() {
    this.getBasicSettingEdit()
  }
}
</script>
