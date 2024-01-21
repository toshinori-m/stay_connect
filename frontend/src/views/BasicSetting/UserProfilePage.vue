<template>
  <div class="mt-36 md:mt-14 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
    <div class="flex items-center">
      <div class="w-32 h-32 rounded-full overflow-hidden">
        <img :src="userProfile.image_url" alt="User Image" class="object-cover w-full h-full">
      </div>
      <div class="ml-4">
        <button class="mt-4 mb-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300" @click="goToChatRoom(userProfile.id)">チーム代表とチャット開始</button>
        <p>（チャット送信5回まで無料）</p>
      </div>
    </div>
    <p class="mt-4 font-semibold text-blue-600">所属チーム紹介:</p>
    <ul>
      <li v-for="team in teams" :key="team.id">
        <button class="mt-2 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300" @click="goToTeamIntroduction(team.id)">{{ team.name }}</button>
      </li>
    </ul>
    <p class="text-sm text-red-400" v-if="!teams.length">チーム情報が存在しません。</p>
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
      teams: [],
      errors: []
    }
  },
  methods: {
    async fetchUserProfile() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get(`/users_profile/${this.$route.params.userId}`)
        this.userProfile = res.data.data
        this.fetchTeams()
      } catch {
        this.errors.push('自己紹介を表示できませんでした。')
      }
    },
    async goToChatRoom(otherUserId) {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.post('/chat_rooms', {
          other_user_id: otherUserId
        })
        this.$router.push({ name: 'ChatRoomPage', params: { id: res.data.data.id } })
      } catch {
        this.errors.push('チャットルーム画面を表示できませんでした。')
      }
    },
    async fetchTeams() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get(`/users/${this.userProfile.id}/teams_profile`)
        this.teams = res.data
      } catch {
        this.errors.push('チーム情報を取得できませんでした。')
      }
    },
    async goToTeamIntroduction(teamId) {
      try {
        this.errors = []
        this.$router.push({ name: 'TeamProfileIntroductionPage', params: { id: teamId } })
      } catch {
        this.errors.push('チームIDが指定されていません。')
      }
    },
    async fetchTeams() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get(`/users/${this.userProfile.id}/teams_profile`)
        this.teams = res.data
      } catch (error) {
        this.errors.push('チーム情報を取得できませんでした。')
      }
    },
    async goToTeamIntroduction(teamId) {
      try {
        this.$router.push({ name: 'TeamProfileIntroductionPage', params: { id: teamId } })
      } catch {
        this.errors.push('チームIDが指定されていません。')
      }
    }
  },
  mounted() {
    this.fetchUserProfile()
  }
}
</script>
