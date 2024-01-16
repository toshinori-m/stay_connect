<template>
  <div class="mt-36 md:mt-14 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div class="error text-sm text-red-400">{{ error }}</div>
    <img :src="userProfile.image_url" alt="User Image" class="w-full h-auto mb-4">
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300" @click="goToChatRoom(userProfile.id)">チャットを開始</button>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">名前:</span>
      {{ userProfile.name }}
    </p>
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
        this.userProfile = res.data.data
      } catch {
        this.error = '自己紹介を表示できませんでした。'
      }
    },
    async goToChatRoom(otherUserId) {
      try {
        this.error = null
        const apiClient = getApiClient()
        const res = await apiClient.post('/chat_rooms', {
          other_user_id: otherUserId
        })
        this.$router.push({ name: 'ChatRoomPage', params: { id: res.data.data.id } })
      } catch {
        this.error = 'チャットルーム画面を表示できませんでした。'
      }
    }
  },
  mounted() {
    this.fetchUserProfile()
  }
}
</script>
