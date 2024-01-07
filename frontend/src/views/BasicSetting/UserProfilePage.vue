<template>
  <div class="mt-36 md:mt-14 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div class="error text-sm text-red-400">{{ error }}</div>
    <h1 class="text-2xl font-light mb-4">
      <span class="font-bold mr-3 text-blue-600">名前:</span>
      {{ userProfile.name }}
    </h1>
    <img :src="userProfile.image_url" alt="User Image" class="w-full h-auto mb-4">
    <p class="mb-2">
      <span class="font-semibold text-blue-600">性別:</span>
      {{ userProfile.sex }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">自己紹介:</span>
      {{ userProfile.self_introduction }}
    </p>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      userProfile: {},
        error: null
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        this.error = null
        const apiClient = getApiClient()
        const res = await apiClient.get(`/users_profile/${this.$route.params.userId}`)
        console.log("res.data.data",res.data.data)
        this.userProfile = res.data.data
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }
  },
  mounted() {
    this.fetchUserProfile()
  }
}
</script>
