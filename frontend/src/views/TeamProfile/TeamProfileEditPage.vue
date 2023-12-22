<template>
  <div class="flex items-center justify-center mt-32 xl:mt-20">
    <div class="xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">チーム紹介編集</h2>
      <button class="cancel_button mx-5 float-right" @click="TeamProfileEditCancel">戻る</button>
      <div class="my-10">
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
        <form class= "text-center" @submit.prevent="editTeamProfile">
          <ul>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start float-center xl:mt-3 ml-28 sm:ml-4" for="sports_type">競技名</label>
              <select class="xl:place-self-center float-center sm:ml-20 py-1 px-1 my-2 w-72 sm:w-52 xl:w-72 xl:ml-28 border-2 border-gray-200 box-border" id="sports_type" v-model="sports_type_selected"  @change="getSportsDiscipline">
                <option disabled value="競技">1つを選択して下さい</option>
                <option v-for="sports_type in sports_types" :key="sports_type.id" :value="sports_type">
                  {{ sports_type.name }}
                </option>
              </select>
            </li>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 mx-4 sm:mr-12" for="discipline" v-if="sports_disciplines.length > 0">種目</label>
              <select class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="discipline"  v-model="sports_discipline_selected" multiple v-if="sports_disciplines.length > 0">
                <option v-for="sports_discipline in sports_disciplines" :key="sports_discipline.id" :value="sports_discipline">
                  {{ sports_discipline.name }}
                </option>
              </select>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md">{{ sports_discipline_selected.length ? sports_discipline_selected.map(sport => sport.name).join(", ") : '' }}</div>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 mx-4" for="prefecture">都道府県</label>
              <select class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="prefecture"  v-model="prefecture_selected">
                <option disabled value="">1つを選択して下さい</option>
                <option v-for="prefecture in prefectures" :key="prefecture.id" :value="prefecture.id" >
                  {{ prefecture.name }}
                </option>
              </select>
            </li>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 ml-4 sm:mr-5" for="name">チーム名</label>
              <input class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="name" type="text" v-model="team.name">
            </li>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start xl:mt-3 ml-6 mr-8 sm:mr-1" for="area">活動地域</label>
              <textarea class="xl:place-self-center mx-10 text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" id="area" name="textarea" required placeholder="活動地域" v-model="team.area"></textarea>
            </li>
            <li class="xl:grid grid-cols-6 gap-6 items-end mb-2.5 items-center xl:my-4">
              <label class="xl:place-self-start  xl:mt-1 xl:mr-1 mx-4">性別</label>
              <label for="man">
                <input type="radio" id="man" value="man" name="sex" v-model="team.sex" />男
              </label>
              <label for="woman">
                <input type="radio" id="woman" value="woman" name="sex" v-model="team.sex" />女
              </label>
              <label for="mix">
                <input type="radio" id="mix" value="mix" name="sex" v-model="team.sex" />男女
              </label>
              <label for="man_and_woman">
                <input type="radio" id="man_and_woman" value="man_and_woman" name="sex" v-model="team.sex" />混合
              </label>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md" type="text">{{ team.sex }}</div>
            <div v-if="backend_errors.sex" class="error">{{ backend_errors.sex[0] }}</div>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 mx-4 sm:mr-14" for="target_age">年齢</label>
              <select class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="target_age" v-model="target_age_selected" multiple>
                <option disabled value="">選択して下さい</option>
                <option v-for="target_age in target_ages" :key="target_age.id" :value="target_age">
                  {{ target_age.name }}
                </option>
              </select>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md">{{ target_age_selected.length ? target_age_selected.map(sport => sport.name).join(", ") : '' }}</div>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start  xl:mt-3 mx-4 sm:mr-12" for="record">活度実績</label>
              <textarea class="xl:place-self-center text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" name="textarea" v-model="team.track_record" id="record" required placeholder="track record"></textarea>
            </li>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start  xl:mt-3 mx-5" for="Other">その他</label>
              <textarea  class="xl:place-self-center mx-10 text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" name="textarea" v-model="team.other_body" id="Other" placeholder="Other"></textarea>
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
import apiClient from '@/lib/apiClient'

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
  methods: {
    async getTeamProfileEdit() {
      try {
        this.errors = []
        const teamId = this.$route.params.id;
        const res = await apiClient.get(`http://localhost:3001/teams/${teamId}`)
        this.team = res.data.data
        const rdsRes = await apiClient.get(`http://localhost:3001/teams/${teamId}/sports_disciplines`)
        this.team_sports_disciplines = rdsRes.data
        const rtaRes = await apiClient.get(`http://localhost:3001/teams/${teamId}/target_ages`)
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
        const res = await apiClient.get('http://localhost:3001/sports_types')
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
        const res = await apiClient.get('http://localhost:3001/sports_disciplines', {
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
        const res = await apiClient.get('http://localhost:3001/prefectures')
        this.prefectures = res.data.data
        this.prefecture_selected = this.team.prefecture_id;
      } catch {
        this.errors.push('都道府県を表示できませんでした。')
      }
    },
    async getTargetAge() {
      try {
        this.errors = []
        const res = await apiClient.get('http://localhost:3001/target_ages')
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
        const disciplineIds = this.sports_discipline_selected.map(discipline => discipline.id);
        const targetAgeIds = this.target_age_selected.map(target => target.id);
        if (!this.team) return;
        await apiClient.patch(`http://localhost:3001/teams/${this.team.id}`, {
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
        if (error.response.data.errors) {
          this.backend_errors = error.response.data.errors;
        }
      }
    },
    async deleteTeamProfile() {
      try {
        this.errors = []
        if (!this.team) return;
        await apiClient.delete(`http://localhost:3001/teams/${this.team.id}`)
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
