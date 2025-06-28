<template>
  <div class="flex items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1">競技名編集</h2>
        <button class="cancel_button mx-5 float-right" @click="sportTypeCancel">戻る</button>
        <div class="my-10">
          <div class="error text-sm text-red-400">{{ error }}</div>
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
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      sports_types: [],
      error: null
    }
  },
  methods: {
    async getSportsType() {
      try {
        const apiClient = getApiClient()
        this.error = null
        const res = await apiClient.get('/sports_types')
        this.sports_types = res.data.data
      } catch {
        this.error = '競技名を表示できませんでした。'
      }
    },
    async editSportsType(sportsTypeId) {
      try {
        const apiClient = getApiClient()
        this.error = null
        const sportsType = this.sports_types.find(sports_type => sports_type.id === sportsTypeId);
        if (!sportsType) return;
        await apiClient.patch(`/sports_types/${sportsTypeId}`, {
          name: sportsType.name
        }, {
          withCredentials: true
        })
        this.$router.push({ name: 'SportsTypePage' })
      } catch {
        this.error = '競技名に誤りがあります。'
      }
    },
    async deleteSportsType(sportsTypeId) {
      try {
        const apiClient = getApiClient()
        this.error = null
        await apiClient.delete(`/sports_types/${sportsTypeId}`, {
          withCredentials: true
        })
        this.$router.push({ name: 'SportsTypePage' })
      } catch {
        this.error = '競技名を削除出来ませんでした。'
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
