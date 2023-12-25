<template>
  <div class="flex items-center justify-center mt-36">
    <div class="flex flex-col items-center justify-center md:w-2/5 rounded-md shadow-gray-200 bg-sky-100 justify-center">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-5 md:mt-1">種目名更新</h2>
      <button class="cancel_button mx-5 float-right" @click="sports_discipline_cancel">戻る</button>
      <div class="error text-sm text-red-400">{{ error }}</div>
      <div class="text-center">
        <div class="mt-1 mb-5 xl:text-left xl:grid grid-cols-3 gap-4">
          <label class="xl:mt-3 xl:mx-auto ml-4 mr-10" for="type">競技</label>
          <select class="xl:place-self-center py-2 px-1 my-2 w-72 border-2 border-gray-200 box-border" v-model="sport_type_selected" @change="getSportsDiscipline" >
            <option disabled value="">1つを選択して下さい</option>
            <option v-for="sports_type in sports_types" :key="sports_type.id" :value="sports_type">
              {{ sports_type.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="rounded-2xl mt-2 mx-auto py-2 px-3 sm:w-4/5 md:w-3/4" v-for="sports_discipline in sports_disciplines" :key="sports_discipline.id">
        <form class= "sports_type text-center" @submit.prevent="editSportsDiscipline(sports_discipline.id)">
          <input class="py-3 px-3 w-72 border-2 border-gray-200 box-border" type="text" v-model="sports_discipline.name">
          <ul class="flex items-center justify-evenly">
            <li><button class="update_button">更新</button>
            </li>
            <li><button class="delete_button" @click="deleteSportsDiscipline(sports_discipline.id)">削除</button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      sport_type_selected: null,
      sports_types: [],
      sports_disciplines: [],
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
        this.error = '競技を表示できませんでした。競技を選択して下さい。'
      }
    },
    async getSportsDiscipline() {
      try {
        const apiClient = getApiClient()
        this.error = null
        const res = await apiClient.get('/sports_disciplines', {
          params: {
            sports_type_id: this.sport_type_selected.id
          }
        })
        this.sports_disciplines = res.data.data
      } catch {
        this.error = '種目を選択していません。'
      }
    },
    async editSportsDiscipline(sportsDisciplineId) {
      try {
        const apiClient = getApiClient()
        this.error = null
        const sportsDiscipline = this.sports_disciplines.find(sports_discipline => sports_discipline.id === sportsDisciplineId);
        if (!sportsDiscipline) return;
        await apiClient.patch(`/sports_disciplines/${sportsDisciplineId}`, {
          name: sportsDiscipline.name
        })
        this.$router.push({ name: 'SportsDisciplinePage' })
      } catch {
        this.error = '種目に誤りがあります。'
      }
    },
    async deleteSportsDiscipline(sportsDisciplineId) {
      try {
        const apiClient = getApiClient()
        this.error = null
        await apiClient.delete(`/sports_disciplines/${sportsDisciplineId}`)
        this.$router.push({ name: 'SportsDisciplinePage' })
      } catch {
        this.error = '競技名を削除出来ませんでした。'
      }
    },
    sports_discipline_cancel() {
      this.$router.push({name: 'SportsDisciplinePage'})
    }
  },
  mounted() {
    this.getSportsType()
  }
}
</script>
