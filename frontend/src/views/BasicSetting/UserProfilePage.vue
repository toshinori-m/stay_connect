<template>
  <div class="mt-36 md:mt-14 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div class="error text-sm text-red-400">{{ error }}</div>
    <img :src="userProfile.image_url" alt="User Image" class="w-full h-auto mb-4">
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300" @click="goToChatRoom">チャットを開始</button>
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
      chat_rooms: [],
      errors: null
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get(`/users_profile/${this.$route.params.userId}`)
        console.log("users_profile_res.data.data",res.data.data)
        this.userProfile = res.data.data
      } catch {
        this.errors.push('自己紹介を表示できませんでした。')
      }
    },
    async getChatRoomList() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/chat_rooms')
        this.chat_rooms = res.data
        console.log("chat_rooms_res.data",res.data)
      } catch {
        this.errors.push('チャットルームを取得できませんでした。')
      }
    },
    goToChatRoom() {
      this.$router.push({ name: 'ChatRoomPage', params: { id: this.userProfile.chat_room_id } })
    }
  },
  mounted() {
    this.fetchUserProfile()
    this.getChatRoomList()
  }
}
</script>
