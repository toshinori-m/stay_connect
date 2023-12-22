<template>
  <div class="flex items-center justify-center mt-32 xl:mt-20">
    <div class="xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">チーム紹介作成</h2>
      <div class="my-5">
        <form class= "text-center" @submit.prevent="TeamProfile">
          <ul>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 xl:ml-4 ml-4 mr-8" for="sports_type">競技名</label>
              <select class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="sports_type" v-model="sports_type_selected" @change="getSportsDiscipline" >
                <option disabled value="競技">1つを選択して下さい</option>
                <option v-for="sports_type in sports_types" :key="sports_type.id" :value="sports_type">
                  {{ sports_type.name }}
                </option>
              </select>
              <div class="error">{{ sports_type_selected_error }}</div>
            </li>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 mx-4" for="discipline" v-if="sports_disciplines.length > 0">種目</label>
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
                <option v-for="prefecture in prefectures" :key="prefecture.id" :value="prefecture.id">
                  {{ prefecture.name }}
                </option>
              </select>
              <div class="error">{{ prefecture_selected_error }}</div>
            </li>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 ml-4 sm:mr-6" for="event_name">チーム名</label>
              <input class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="event_name" type="text" required placeholder="チーム名" v-model="event_name">
            </li>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start xl:mt-3 ml-6 mr-8 sm:mr-1" for="area">活動地域</label>
              <textarea class="xl:place-self-center mx-10 text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" id="area" name="textarea" required placeholder="活動地域" v-model="area"></textarea>
            </li>
            <li class="xl:grid grid-cols-6 gap-6 items-end mb-2.5 items-center">
              <label class="xl:place-self-start  xl:mt-3 xl:mr-1 mx-4">性別</label>
              <label for="man">
                <input type="radio" id="man" value="man" name="sex" v-model="sex" />男
              </label>
              <label for="woman">
                <input type="radio" id="woman" value="woman" name="sex" v-model="sex" />女
              </label>
              <label for="mix">
                <input type="radio" id="mix" value="mix" name="sex" v-model="sex" />男女
              </label>
              <label for="man_and_woman">
                <input type="radio" id="man_and_woman" value="man_and_woman" name="sex" v-model="sex" />混合
              </label>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md" type="text">{{ sex }}</div>
            <div v-if="backend_errors.sex" class="error">{{ backend_errors.sex[0] }}</div>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 mx-4 sm:mr-14" for="target_age">年齢</label>
              <select class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="target_age" v-model="target_age_selected" multiple>
                <option disabled value="">選択して下さい</option>
                <option v-for="target_age in target_ages" :key="target_age.id" :value="target_age">
                  {{ target_age.name }}
                </option>
              </select>
              <div class="error">{{ target_age_selected_error }}</div>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md">{{ target_age_selected.length ? target_age_selected.map(age => age.name).join(", ") : '' }}</div>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start  xl:mt-3 mx-4" for="record">活度実績</label>
              <textarea class="xl:place-self-center mx-10 text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" name="textarea" v-model="track_record" id="record" required placeholder="track record"></textarea>
            </li>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start  xl:mt-3 mx-5 sm:mr-7" for="Other">その他</label>
              <textarea  class="xl:place-self-center mx-10 text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" name="textarea" v-model="other_body" id="Other" placeholder="Other"></textarea>
            </li>
          </ul>
          <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
          <button class="ok_button mt-5">登録</button>
          <button class="cancel_button mb-5 mx-2 xl:mx-5" @click="TeamProfileCancel">戻る</button>
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
      sports_type_selected: null,
      sports_discipline_selected: [],
      prefecture_selected: null,
      sports_types: [],
      sports_disciplines: [],
      prefectures: [],
      event_name: "",
      area: "",
      sex: "",
      target_age_selected: [],
      target_ages: [],
      track_record: "",
      other_body: "",
      sports_type_selected_error: "",
      prefecture_selected_error: "",
      target_age_selected_error: "",
      errors: [],
      backend_errors: ""
    }
  },
  methods: {
    async TeamProfile() {
      this.sports_type_selected_error = ""
      this.prefecture_selected_error = ""
      this.target_age_selected_error = ""
      if (!this.sports_type_selected) {
        return this.sports_type_selected_error = '競技を選択して下さい';
      }
      if (!this.prefecture_selected) {
        return this.prefecture_selected_error = '都道府県を選択して下さい';
      }
      if (!this.target_age_selected.length) {
        return this.target_age_selected_error = '対象年齢を選択して下さい';
      }
      try {
        this.backend_errors = ""
        const disciplineIds = this.sports_discipline_selected.map(discipline => discipline.id)
        const targetAgeIds = this.target_age_selected.map(target => target.id)
        await apiClient.post('/teams', {
          team: { 
            name: this.event_name,
            area: this.area,
            sex: this.sex,
            track_record: this.track_record,
            other_body: this.other_body,
            sports_type_id: this.sports_type_selected.id,
            sports_discipline_ids: disciplineIds,
            prefecture_id: this.prefecture_selected,
            target_age_ids: targetAgeIds
          }
        })
        this.$router.push({ name: 'HomePage' })
      } catch (errors) {
        if (errors.response.data.errors) {
          this.backend_errors = errors.response.data.errors;
        }
      }
    },
    async getSportsType () {
      try {
        this.errors = []
        const res = await apiClient.get('/sports_types')
        this.sports_types = res.data.data
      } catch {
        this.errors.push('競技を表示できませんでした。')
      }
    },
    async getSportsDiscipline () {
      try {
        this.errors = []
        const res = await apiClient.get('/sports_disciplines', {
          params: {
            sports_type_id: this.sports_type_selected.id
          }
        })
        this.sports_disciplines = res.data.data
      } catch {
        this.errors.push('種目を表示できませんでした。')
      }
    },
    async getPrefectures () {
      try {
        this.errors = []
        const res = await apiClient.get('/prefectures')
        this.prefectures = res.data.data
      } catch {
        this.errors.push('都道府県を表示できませんでした。')
      }
    },
    async getTargetAge () {
      try {
        this.errors = []
        const res = await apiClient.get('/target_ages')
        this.target_ages = res.data.data
      } catch {
        this.errors.push('対象年齢を表示できませんでした。')
      }
    },
    TeamProfileCancel() {
      this.$router.push({name: 'HomePage'})
    }
  },
  mounted() {
    this.getSportsType()
    this.getPrefectures()
    this.getTargetAge()
  }
}
</script>
