<template>
  <div class="flex items-center justify-center mt-32 md:mt-20">
    <div class="w-full md:w-3/5 xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <button class="cancel_button mx-5 mt-8 float-right" @click="TeamProfileEditCancel">戻る</button>
      <h2 class="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">チーム紹介編集</h2>
      <div class="px-4 md:px-0">
        <form class= "text-center" @submit.prevent="editTeamProfile">
          <ul class="space-y-4 mb-5">
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="sports_type">競技名</label>
              <div class="md:col-span-8">
                <select class="w-full py-2 px-3 border-2 border-gray-200 box-border md:-mb-52" id="sports_type" v-model="sports_type_selected"  @change="getSportsDiscipline">
                  <option disabled value="競技">1つを選択して下さい</option>
                  <option v-for="sports_type in sports_types" :key="sports_type.id" :value="sports_type">
                    {{ sports_type.name }}
                  </option>
                </select>
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="discipline" v-if="sports_disciplines.length">種目</label>
              <div class="md:col-span-8">
                <select class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="discipline"  v-model="sports_discipline_selected" multiple v-if="sports_disciplines.length">
                  <option v-for="sports_discipline in sports_disciplines" :key="sports_discipline.id" :value="sports_discipline">
                    {{ sports_discipline.name }}
                  </option>
                </select>
              </div>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md">{{ selectedSports() }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="prefecture">都道府県</label>
              <div class="md:col-span-8">
                <select class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="prefecture"  v-model="prefecture_selected">
                  <option disabled value="">1つを選択して下さい</option>
                  <option v-for="prefecture in prefectures" :key="prefecture.id" :value="prefecture.id" >
                    {{ prefecture.name }}
                  </option>
                </select>
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="name">チーム名</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="name" type="text" v-model="team.name">
                <div v-if="remainingCharactersTeamtName <= 5" class="text-red-500">
                  チーム名はあと{{ remainingCharactersTeamtName }}文字までです。
                </div>
              </div>
            </li>
            <div class="error" v-for="(errMsg, index) in backend_errors.name" :key="index">{{ errMsg }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="area">活動地域</label>
              <div class="md:col-span-8">
                <textarea class="w-full h-32 py-2 px-3 border-2 border-gray-200 box-border" id="area" name="textarea" required placeholder="活動地域" v-model="team.area"></textarea>
                <div v-if="remainingCharactersArea <= 5" class="text-red-500">
                  地域はあと{{ remainingCharactersArea }}文字までです。
                </div>
              </div>
            </li>
            <div class="error" v-for="(errMsg, index) in backend_errors.area" :key="index">{{ errMsg }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2">性別</label>
              <div class="md:col-span-8 grid grid-cols-4 gap-4">
                <div class="md:-mx-3">
                  <label for="man">
                    <input type="radio" value="man" name="sex" v-model="team.sex" />男
                  </label>
                </div>
                <div class="md:-mx-3">
                  <label for="woman">
                    <input type="radio" value="woman" name="sex" v-model="team.sex" />女
                  </label>
                </div>
                <div class="md:-mx-3">
                  <label for="mix">
                    <input type="radio" value="mix" name="sex" v-model="team.sex" />男女
                  </label>
                </div>
                <div class="md:-mx-3">
                  <label for="man_and_woman">
                    <input type="radio" value="man_and_woman" name="sex" v-model="team.sex" />混合
                  </label>
                </div>
              </div>
            </li>
            <div class="error" v-for="(errMsg, index) in backend_errors.sex" :key="index">{{ errMsg }}</div>
            <div class="md:-mb-16">
              <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <label class="md:col-span-4 text-left px-3 py-2" for="target_age">年齢</label>
                <div class="md:col-span-8">
                  <select class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="target_age" v-model="target_age_selected" multiple>
                    <option disabled value="">選択して下さい</option>
                    <option v-for="target_age in target_ages" :key="target_age.id" :value="target_age">
                      {{ target_age.name }}
                    </option>
                  </select>
                </div>
              </li>
            </div>
            <div class="mb-5 mx-5 bg-white rounded-md">{{ targetAges() }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="record">活度実績</label>
              <div class="md:col-span-8">
                <textarea class="w-full h-32 py-2 px-3 border-2 border-gray-200 box-border" name="textarea" v-model="team.track_record" id="record" required placeholder="track record"></textarea>
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="Other">その他</label>
              <div class="md:col-span-8">
                <textarea  class="w-full h-32 py-2 px-3 border-2 border-gray-200 box-border" name="textarea" v-model="team.other_body" id="Other" placeholder="その他"></textarea>
              </div>
            </li>
            <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
            <button class="update_button mx-5">更新</button>
            <button type="button" class="delete_button mx-5" @click="deleteTeamProfile">削除</button>
          </ul>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      team: {},
      team_sports_disciplines: [],
      team_target_ages: [],
      sports_type_selected: null,
      sports_discipline_selected: [],
      prefecture_selected: null,
      sports_types: [],
      sports_disciplines: [],
      prefectures: [],
      target_age_selected: [],
      target_ages: [],
      name: "",
      area: "",
      sex: "",
      track_record: "",
      other_body: "",
      errors: [],
      backend_errors: ""
    }
  },
  computed: {
    remainingCharactersTeamtName() {
      if(!this.team.name) return 0
      const maxChars = 255
      const nameLength = this.team.name.length ?? 0
      return maxChars - nameLength
    },
    remainingCharactersArea() {
      if(!this.team.area) return 0
      const maxChars = 255
      const areaLength = this.team.area.length ?? 0
      return maxChars - areaLength
    }
  },
  methods: {
    selectedSports(){
      return this.sports_discipline_selected.length ? this.sports_discipline_selected.map(sport => sport.name).join(", ") : ''
    },
    targetAges(){
      return this.target_age_selected.length ? this.target_age_selected.map(age => age.name).join(", ") : ''
    },
    async getTeamProfileEdit() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const teamId = this.$route.params.id;
        const res = await apiClient.get(`/teams/${teamId}`)
        console.log("res.data.data",res.data.data)
        this.team = res.data.data
        const rdsRes = await apiClient.get(`/teams/${teamId}/sports_disciplines`)
        this.team_sports_disciplines = rdsRes.data
        const rtaRes = await apiClient.get(`/teams/${teamId}/target_ages`)
        this.team_target_ages = rtaRes.data
        this.getSportsType()
        this.getPrefectures()
        this.getTargetAge()
      } catch {
        this.errors.push('チーム紹介を表示できませんでした。')
      }
    },
    async getSportsType() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/sports_types')
        this.sports_types = res.data.data
        const sportsTypeId = this.team.sports_type_id;
        this.sports_type_selected = this.sports_types.find(st => st.id === sportsTypeId);
        this.getSportsDiscipline();
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
            sports_type_id: this.sports_type_selected.id
          }
        })
        this.sports_disciplines = res.data.data
        this.sports_discipline_selected = this.team_sports_disciplines.map(rsd => 
        this.sports_disciplines.find(sd => sd.id === rsd.sports_discipline_id)).filter(Boolean);
      } catch {
        this.errors.push('種目を選択していません。')
      }
    },
    async getPrefectures () {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/prefectures')
        this.prefectures = res.data.data
        this.prefecture_selected = this.team.prefecture_id;
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
        this.target_age_selected = this.team_target_ages.map(rta => 
        this.target_ages.find(ta => ta.id === rta.target_age_id)).filter(Boolean);
      } catch {
        this.errors.push('対象年齢を表示できませんでした。')
      }
    },
    async editTeamProfile() {
      try {
        this.backend_errors = ""
        const apiClient = getApiClient()
        const disciplineIds = this.sports_discipline_selected.map(discipline => discipline.id)
        const targetAgeIds = this.target_age_selected.map(target => target.id)
        if (!this.team) return
        await apiClient.patch(`/teams/${this.team.id}`, {
          team: { 
            name: this.team.name,
            area: this.team.area,
            sex: this.team.sex,
            track_record: this.team.track_record,
            other_body: this.team.other_body,
            sports_type_id: this.sports_type_selected.id,
            sports_discipline_ids: disciplineIds,
            prefecture_id: this.prefecture_selected,
            target_age_ids: targetAgeIds,
          }
        })
        this.$router.push({ name: 'TeamProfileListPage' })
      } catch (error) {
        this.backend_errors = error.response.data.errors
      }
    },
    async deleteTeamProfile() {
      try {
        const apiClient = getApiClient()
        this.errors = []
        if (!this.team) return;
        await apiClient.delete(`/teams/${this.team.id}`)
        this.$router.push({ name: 'TeamProfileListPage' })
      } catch {
        this.errors.push('チーム紹介を削除出来ませんでした。')
      }
    },
    TeamProfileEditCancel() {
      this.$router.push({name: 'TeamProfileListPage'})
    }
  },
  mounted() {
    this.getTeamProfileEdit()
  }
}
</script>
