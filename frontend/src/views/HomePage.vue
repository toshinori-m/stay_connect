<template>
  <div class="my-20 mx-auto p-4">
    <form @submit.prevent="fetchRecruitments" class="flex gap-2 mb-4">
      <input type="text" v-model="searchParams.sports_type_name" class="form-input border-gray-300 rounded-md" placeholder="競技">
      <input type="text" v-model="searchParams.sports_discipline_name" class="form-input border-gray-300 rounded-md" placeholder="競技種目">
      <input type="text" v-model="searchParams.prefecture_name" class="form-input border-gray-300 rounded-md" placeholder="都道府県">
      <input type="text" v-model="searchParams.target_age_name" class="form-input border-gray-300 rounded-md" placeholder="対象年齢">
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">検索</button>
    </form>

    <table class="table-auto w-full">
      <thead>
        <tr class="bg-blue-500 text-white">
          <th class="px-4 py-2">イベント名</th>
          <th class="px-4 py-2">エリア</th>
          <th class="px-4 py-2">性別</th>
          <th class="px-4 py-2">人数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="recruitment in recruitments" :key="recruitment.id" class="bg-gray-100">
          <td class="border px-4 py-2">{{ recruitment.name }}</td>
          <td class="border px-4 py-2">{{ recruitment.area }}</td>
          <td class="border px-4 py-2">{{ recruitment.sex }}</td>
          <td class="border px-4 py-2">{{ recruitment.number }}</td>
        </tr>
      </tbody>
    </table>
    <div class="error text-sm text-red-400">{{ error }}</div>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      searchParams: {
        sports_type_name: '',
        prefecture_name: '',
        target_age_name: '',
        sports_discipline_name: ''
      },
      recruitments: [],
      error: null
    }
  },
  methods: {
    async fetchRecruitments() {
      try {
        this.error = null
        const apiClient = getApiClient()
        const res = await apiClient.get('/searches', { params: this.searchParams })
        this.recruitments = res.data;
      } catch {
        this.error = '選択に誤りがあります。'
      }
    }
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn
    }
  },
  mounted() {
    this.fetchRecruitments()
  }
}
</script>
