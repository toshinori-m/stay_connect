<template>
  <div class="mt-36 md:mt-14 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-light mb-4"><span class="font-bold mr-3 text-blue-600">イベント名:</span>{{ eventDetails.name }}</h1>
    <img :src="eventDetails.image" alt="Event Image" class="w-full h-auto mb-4">
    <div class="text-right">
      <button class="ok_button mt-4 md:mt-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="goToUserProfile(eventDetails.user_id)">代表紹介</button>
    </div>
    <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
    <p class="mb-2"><span class="font-semibold text-blue-600">競技:</span> {{ sports_type.name }}</p>
    <p class="mb-2" v-if="eventDetails.sports_disciplines && eventDetails.sports_disciplines.length > 0"><span class="font-semibold text-blue-600">種目:</span> {{ sportsDisciplinesNames() }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">都道府県:</span> {{ prefecture.name }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">開催地:</span> {{ eventDetails.area }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">対象年齢:</span> {{ targetAgesNames() }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">目的:</span> {{ eventDetails.purpose_body }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">開始日:</span> {{ eventDetails.start_date }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">終了日:</span> {{ eventDetails.end_date }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">性別:</span> {{ eventDetails.sex }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">人数:</span> {{ eventDetails.number }}</p>
    <p class="mb-2"><span class="font-semibold text-blue-600">その他:</span> {{ eventDetails.other_body }}</p>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      eventDetails: {},
      sports_type: "",
      prefecture: "",
      errors: []
    }
  },
  methods: {
    sportsDisciplinesNames() {
      if (this.eventDetails.sports_disciplines?.length > 0) {
        return this.eventDetails.sports_disciplines.map(sd => sd.name).join(', ')
      }
      return ''
    },
    targetAgesNames() {
      if (this.eventDetails.target_ages?.length > 0) {
        return this.eventDetails.target_ages.map(age => age.name).join(', ')
      }
      return ''
    },
    async fetchEventDetails() {
      try {
        this.errors = []
        const recruitmentId = this.$route.params.id
        const apiClient = getApiClient()
        const res = await apiClient.get(`/recruitments/${recruitmentId}`)
        this.eventDetails = res.data.data
        this.getPrefectures()
        await this.getSportsType()
      } catch {
        this.errors.push('イベントを表示できませんでした。')
      }
    },
    async getSportsType() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/sports_types')
        this.sports_type = res.data.data.find(type => type.id === this.eventDetails.sports_type_id)
      } catch {
        this.errors.push('競技を表示できませんでした。')
      }
    },
    async getPrefectures() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/prefectures')
        this.prefecture = res.data.data.find(pr => pr.id === this.eventDetails.prefecture_id)
      } catch {
        this.errors.push('都道府県を表示できませんでした。')
      }
    },
    goToUserProfile(userId) {
      this.$router.push({ name: 'UserProfilePage', params: { userId: userId } })
    }
  },
  mounted() {
    this.fetchEventDetails()
  }
}
</script>
