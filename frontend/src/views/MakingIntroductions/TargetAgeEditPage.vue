<template>
  <div class="flex items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1">対象年齢編集</h2>
        <button class="cancel_button mx-5 float-right" @click="TargetAgeCancel">戻る</button>
        <div class=" my-10">
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
        <div class="rounded-2xl mt-2 mx-auto py-2 px-3 sm:w-4/5 md:w-3/4" v-for="target_age in target_ages" :key="target_age.id">
          <form class= "target_age text-center" @submit.prevent="editTargetAge(target_age.id)">
            <input class="sm:ml-4 sm:mr-6 py-3 px-3 w-72 border-2 border-gray-200 box-border" type="text" v-model="target_age.name">
            <ul class="flex items-center justify-evenly">
              <li><button class="update_button">更新</button>
              </li>
              <li><button class="delete_button" @click="deleteTargetAge(target_age.id)">削除</button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      target_ages: [],
      errors: []
    }
  },
  methods: {
    async getTargetAge() {
      try {
        this.errors = []
        const res = await axios.get(`http://localhost:3001/target_ages/`, {
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid')
        })
        this.target_ages = res.data.data
      } catch (error) {
        this.errors.push('対象年齢を表示できませんでした。')
      }
    },
    async editTargetAge(targetAgeId) {
      try {
        this.errors = []
        const targetAge = this.target_ages.find(target_age => target_age.id === targetAgeId);
        if (!targetAge) return;
        await axios.patch(`http://localhost:3001/target_ages/${targetAgeId}`, {
          name: targetAge.name,
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid')
        })
        this.$router.push({ name: 'TargetAgePage' })
      } catch (error) {
        this.errors.push('対象年齢に誤りがあります。')
      }
    },
    async deleteTargetAge(targetAgeId) {
      try {
        this.errors = []
        await axios.delete(`http://localhost:3001/target_ages/${targetAgeId}`, {
          data: {
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid')
          }
        })
        this.$router.push({ name: 'TargetAgePage' })
      } catch (error) {
        this.errors.push('対象年齢を削除出来ませんでした。')
      }
    },
    TargetAgeCancel() {
      this.$router.push({name: 'TargetAgePage'})
    }
  },
  mounted() {
    this.getTargetAge()
  }
}
</script>
