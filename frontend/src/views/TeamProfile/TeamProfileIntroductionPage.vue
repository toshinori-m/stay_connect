<template>
  <div class="mt-36 md:mt-14 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
    <div class="text-right">
      <button class="ok_button mt-4 md:mt-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="goToUserProfile(teamProfile.user_id)">代表紹介</button>
    </div>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">チーム名:</span>
      {{ teamProfile.name }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">競技:</span>
      {{ sports_type.name }}
    </p>
    <p class="mb-2" v-if="sports_disciplines.length > 0">
      <span class="font-semibold text-blue-600">種目:</span>
      {{ sports_disciplines_current.length ? sports_disciplines_current.map(sport => sport.name).join(", ") : '' }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">活動都道府県:</span>
      {{ prefecture.name }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">活動地域:</span>
      {{ teamProfile.area }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">性別:</span>
      {{ teamProfile.sex }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">対象年齢:</span>
      {{ target_age_current.length ? target_age_current.map(sport => sport.name).join(", ") : '' }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">活動実績:</span>
      {{ teamProfile.track_record }}
    </p>
    <p class="mb-2">
      <span class="font-semibold text-blue-600">チームPR:</span>
      {{ teamProfile.other_body }}
    </p>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      teamProfile: {},
      team_sports_disciplines: [],
      team_target_ages: [],
      sports_disciplines: [],
      sports_type: {},
      sports_disciplines_current: [],
      prefecture: {},
      target_age_current: [],
      errors: []
    }
  },
  methods: {
    async fetchTeamProfile() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const teamId = this.$route.params.id
        const res = await apiClient.get(`/teams/${teamId}`)
        this.teamProfile = res.data.data
        const rdsRes = await apiClient.get(`/teams/${teamId}/sports_disciplines`)
        this.team_sports_disciplines = rdsRes.data
        const rtaRes = await apiClient.get(`/teams/${teamId}/target_ages`)
        this.team_target_ages = rtaRes.data
        this.getSportsType()
        this.getPrefectures()
        this.getTargetAge()
      } catch {
        this.errors.push('チーム情報を表示できませんでした。')
      }
    },
    async getSportsType() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/sports_types')
        this.sports_types = res.data.data
        this.sports_type = this.sports_types.find(st => st.id === this.teamProfile.sports_type_id)
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
            sports_type_id: this.sports_type.id
          }
        })
        this.sports_disciplines = res.data.data
        this.sports_disciplines_current = this.team_sports_disciplines.map(rsd => 
        this.sports_disciplines.find(sd => sd.id === rsd.sports_discipline_id)).filter(Boolean)
      } catch {
        this.errors.push('種目を表示できませんでした。')
      }
    },
    async getPrefectures () {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/prefectures')
        this.prefectures = res.data.data
        this.prefecture = this.prefectures.find(tp => tp.id === this.teamProfile.prefecture_id)
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
        this.target_age_current = this.team_target_ages.map(tta => this.target_ages.find(ta => ta.id === tta.target_age_id))
      } catch {
        this.errors.push('対象年齢を表示できませんでした。')
      }
    },
    goToUserProfile(userId) {
      this.$router.push({ name: 'UserProfilePage', params: { userId: userId } })
    }
  },
  mounted() {
    this.fetchTeamProfile()
  }
}
</script>
