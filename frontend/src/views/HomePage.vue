<template>
  <div class="mt-32 md:mt-20 mx-auto p-4 md:flex md:items-start">
    <div class="rounded-lg bg-sky-100 drop-shadow-lg mb-4 md:w-1/4 md:mb-0 md:mr-4 pb-3 px-3"> 
      <h2 class="mb-5 text-center pt-10 font-bold text-2xl text-blue-600">カテゴリー別検索</h2>
      <form @submit.prevent="fetchRecruitments" class="flex flex-col gap-2">
        <select class="ring-offset-2 ring-2 hover:bg-blue-200 my-3 py-2 px-1 rounded-md" v-model="sports_type_selected" @change="getSportsDiscipline">
          <option disabled value="">競技選択</option>
          <option v-for="sports_type in sports_types" :key="sports_type.id" :value="sports_type">
            {{ sports_type.name }}
          </option>
        </select>
        <select class="ring-offset-2 ring-2 hover:bg-blue-200 my-3 py-2 px-1 rounded-md" v-model="sports_discipline_selected" v-if="sports_disciplines.length > 0">
          <option disabled value="">種目選択</option>
          <option v-for="sports_discipline in sports_disciplines" :key="sports_discipline.id" :value="sports_discipline">
            {{ sports_discipline.name }}
          </option>
        </select>
        <select class="ring-offset-2 ring-2 hover:bg-blue-200 my-3 py-2 px-1 rounded-md" v-model="prefecture_selected">
          <option disabled value="">都道府県選択</option>
          <option v-for="prefecture in prefectures" :key="prefecture.id" :value="prefecture" >
            {{ prefecture.name }}
          </option>
        </select>
        <select class="ring-offset-2 ring-2 hover:bg-blue-200 my-3 py-2 px-1 rounded-md" v-model="target_age_selected">
          <option disabled value="">対象年齢選択</option>
          <option v-for="target_age in target_ages" :key="target_age.id" :value="target_age">
            {{ target_age.name }}
          </option>
        </select>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700" type="submit">検索</button>
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
      </form>
    </div>
    <div class="md:mt-0 md:w-full mx-auto p-4 md:flex md:items-start">
      <div class="md:w-full mx-auto">
        <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-4" v-for="recruitment in recruitments" :key="recruitment.id">
          <div class="cursor-pointer" @click="listEvent(recruitment.id)">
            <div class="flex items-center justify-between"> 
              <h3 class="text-lg font-bold text-blue-600">{{ recruitment.name }}</h3>
              <span class="ml-4 text-sm text-gray-600">{{ recruitment.prefecture_name }}</span>
            </div>
            <div class="mt-2">
              <span class="text-sm font-semibold text-blue-600">競技:</span> <span class="text-sm mr-4">{{ recruitment.sports_type_name }}</span>
              <span class="text-sm font-semibold text-blue-600" for="discipline" v-if="recruitment.sports_discipline_name.length > 0">種目:</span> <span class="text-sm mr-2">{{ sportsDisciplineNames(recruitment.sports_discipline_name) }}</span>
            </div>
            <div class="mt-2">
              <span class="text-sm font-semibold text-blue-600">イベント目的:</span> <span class="text-sm mr-2">{{ recruitment.purpose_body }}</span>
            </div>
            <div class="mt-2">
              <span class="text-sm font-semibold text-blue-600">性別:</span> <span class="text-sm mr-4">{{ recruitment.sex }}</span>
              <span class="text-sm font-semibold text-blue-600">対象年齢:</span> <span class="text-sm">{{ targetAgeNames(recruitment.target_age_name) }}</span>
            </div>
          </div>
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
      sports_type_selected: '',
      sports_disciplines: [],
      sports_discipline_selected: '',
      prefectures: [],
      prefecture_selected: '',
      target_ages: [],
      target_age_selected: '',
      recruitments: [],
      errors: []
    }
  },
  methods: {
    sportsDisciplineNames(sportsDisciplines) {
      return sportsDisciplines.map(sd => sd.name).join(', ')
    },
    targetAgeNames(targetAges) {
      return targetAges.map(age => age.name).join(', ');
    },
    async getSportsType() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/sports_types')
        this.sports_types = res.data.data
        this.getSportsDiscipline()
      } catch {
        this.errors.push('競技を表示できませんでした。')
      }
    },
    async getSportsDiscipline() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/sports_disciplines', {
          params: {
            sports_type_id: this.sports_type_selected.id
          }
        })
        this.sports_disciplines = res.data.data
      } catch {
        this.errors.push('種目を選択していません。')
      }
    },
    async getPrefectures() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/prefectures')
        this.prefectures = res.data.data
      } catch {
        this.errors.push('都道府県を表示できませんでした。')
      }
    },
    async getTargetAge() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/target_ages')
        this.target_ages = res.data.data
      } catch {
        this.errors.push('対象年齢を表示できませんでした。')
      }
    },
    async fetchRecruitments() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const params = {
          sports_type_name: this.sports_type_selected.name,
          prefecture_name: this.prefecture_selected.name,
          target_age_name: this.target_age_selected.name,
        }
        const res = await apiClient.get('/searches', { params })
        this.recruitments = res.data
      } catch (error) {
        this.errors.push(error.message || '予期せぬエラーが発生しました。')
      }
    },
    async listEvent(recruitmentId) {
      try {
        this.errors = []
        const apiClient = getApiClient()
        await apiClient.get(`/recruitments/${recruitmentId}`)
        this.$router.push({ name: 'EventPage', params: { id: recruitmentId } })
      } catch {
        this.errors.push('イベントを表示できませんでした。')
      }
    }
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn
    }
  },
  mounted() {
    this.getSportsType()
    this.getPrefectures()
    this.getTargetAge()
    this.fetchRecruitments()
  }
}
</script>
