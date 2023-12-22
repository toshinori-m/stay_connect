<template>
  <div class="flex items-center justify-center mt-12">
    <div class="w-80 md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1 mb-7">チーム紹介一覧</h2>
      <div class="float-right">
        <button class="cancel_button ml-1 mr-2" @click="teamProfileListCancel">戻る</button>
      </div>
      <div class="md:flex justify-center">
        <button class="ok_button ml-2 mr-1" @click="createTeamProfile" :disabled="teams.length >= maxTeamsAllowed">チーム紹介作成
          <br>（最大5チームまで）
        </button>
      </div>
      <div class="mt-10 mb-10">
        <div class="error text-sm text-red-400">{{ error }}</div>
        <div class="flex flex-col items-center mt-10 mb-10">
          <div class="text-left my-3 sm:ml-4 sm:mr-6 w-72 pt-3 ring-offset-2 ring-2 rounded-lg" type="text" v-for="team in teams" :key="team.id">チーム名:{{ team.name }}
            <div class="flex justify-center">
              <button class="update_button" @click="editTeamProfile(team.id)">更新</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      teams: [],
      maxTeamsAllowed: 5,
      error: null
    }
  },
  methods: {
    async getTeamProfile() {
      try {
        this.error = null
        const res = await apiClient.get('/teams')
        this.teams = res.data
      } catch {
        this.error = 'チーム紹介名を表示できませんでした。'
      }
    },
    async editTeamProfile(teamId) {
      this.$router.push({name: 'TeamProfileEditPage', params: {id: teamId} });
    },
    teamProfileListCancel() {
      this.$router.push({name: 'HomePage'})
    },
    createTeamProfile() {
      this.$router.push({name: 'TeamProfilePage'})
    }
  },
  mounted() {
    this.getTeamProfile()
  }
}
</script>
