<template>
  <div class="mt-36 md:mt-14 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div class="error text-sm text-red-400">{{ error }}</div>
    <img :src="teamProfile.image_url" alt="チーム画像" class="w-full h-auto mb-4">
    <p class="mb-2">
      <span class="font-semibold text-blue-600">チーム名:</span>
      {{ teamProfile.name }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">活動地域:</span>
      {{ teamProfile.area }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">性別構成:</span>
      {{ teamProfile.sex }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">年齢層:</span>
      {{ teamProfile.ageGroup }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">活動実績:</span>
      {{ teamProfile.trackRecord }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">その他の情報:</span>
      {{ teamProfile.otherInfo }}
    </p>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      teamProfile: {},
      error: null
    }
  },
  methods: {
    async fetchTeamProfile() {
      try {
        this.error = null
        const apiClient = getApiClient()
        const res = await apiClient.get(`/teams/${this.$route.params.id}`)
        this.teamProfile = res.data.data
      } catch {
        this.error = 'チーム情報を表示できませんでした。'
      }
    }
  },
  mounted() {
    this.fetchTeamProfile()
  }
}
</script>
