<template>
  <div class="flex items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1">競技名編集</h2>
        <button class="cancel_button mx-5 float-right" @click="sportTypeCancel">戻る</button>
        <div class="my-10">
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
        <div class="rounded-2xl mt-2 mx-auto py-2 px-3 sm:w-4/5 md:w-3/4" v-for="sports_type in sports_types" :key="sports_type.id">
          <form class= "sports_type text-center" @submit.prevent="editSportsType(sports_type.id)">
            <input class="sm:ml-4 sm:mr-6 py-3 px-3 w-72 border-2 border-gray-200 box-border" v-model="sports_type.name">
            <ul class="flex items-center justify-evenly">
              <li><button class="update_button">更新</button>
              </li>
              <li><button class="delete_button" @click="deleteSportsType(sports_type.id)">削除</button>
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
      sports_types: [],
      errors: []
    }
  },
  methods: {
    async getSportsType() {
      try {
        this.errors = []
        const res = await axios.get(`http://localhost:3001/sports_types/`, {
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid')
        })
        this.sports_types = res.data.data
      } catch (error) {
        this.errors.push('競技名を表示できませんでした。')
      }
    },
    async editSportsType(sportsTypeId) {
      try {
        this.errors = []
        const sportsType = this.sports_types.find(sports_type => sports_type.id === sportsTypeId);
        if (!sportsType) return;
        await axios.patch(`http://localhost:3001/sports_types/${sportsTypeId}`, {
          name: sportsType.name,
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid')
        })
        this.$router.push({ name: 'SportsTypePage' })
      } catch (error) {
        this.errors.push('競技名に誤りがあります。')
      }
    },
    async deleteSportsType(sportsTypeId) {
      try {
        this.errors = []
        await axios.delete(`http://localhost:3001/sports_types/${sportsTypeId}`, {
          data: {
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid')
          }
        })
        this.$router.push({ name: 'SportsTypePage' })
      } catch (error) {
        this.errors.push('競技名を削除出来ませんでした。')
      }
    },
    sportTypeCancel() {
      this.$router.push({name: 'SportsTypePage'})
    }
  },
  mounted() {
    this.getSportsType()
  }
}
</script>
