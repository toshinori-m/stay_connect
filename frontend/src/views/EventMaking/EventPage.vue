<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-2xl font-bold mb-4">{{ eventDetails.name }}</h1>
    <img :src="eventDetails.image" alt="Event Image" class="w-full h-auto mb-4"/>
    <p class="mb-2"><span class="font-semibold">開催地:</span> {{ eventDetails.area }}</p>
    <p class="mb-2"><span class="font-semibold">性別:</span> {{ eventDetails.sex }}</p>
    <p class="mb-2"><span class="font-semibold">人数:</span> {{ eventDetails.number }}</p>
    <p class="mb-2"><span class="font-semibold">開始日:</span> {{ eventDetails.start_date }}</p>
    <p class="mb-2"><span class="font-semibold">終了日:</span> {{ eventDetails.end_date }}</p>
    <p class="mb-2"><span class="font-semibold">目的:</span> {{ eventDetails.purpose_body }}</p>
    <p class="mb-2"><span class="font-semibold">その他:</span> {{ eventDetails.other_body }}</p>
    <p class="mb-2"><span class="font-semibold">種目:</span> {{ eventDetails.sports_discipline_name }}</p>
    <p class="mb-2"><span class="font-semibold">対象年齢:</span> {{ eventDetails.target_ages?.length > 0 ? eventDetails.target_ages.map(age => age.name).join(', ') : '' }}</p>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      eventDetails: {},
      error: null
    }
  },
  methods: {
    async fetchEventDetails() {
      try {
        const recruitmentId = this.$route.params.id
        const apiClient = getApiClient()
        this.error = null
        const res = await apiClient.get(`/recruitments/${recruitmentId}`)
        console.log("res",res)
        this.eventDetails = res.data.data
        console.log("eventDetails.target_ages",this.eventDetails.target_ages)
      } catch {
      this.error = '競技名を表示できませんでした。'
      }
    }
  },
  mounted() {
    this.fetchEventDetails()
  }
}
</script>
