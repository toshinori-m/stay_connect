<template>
  <div class="flex items-center justify-center mt-32 md:mt-20">
    <div class="w-full md:w-3/5 xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">チーム紹介作成</h2>
      <div class="px-4 md:px-0">
        <form class= "text-center" @submit.prevent="TeamProfile">
          <ul class="space-y-4">
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="sports_type">競技名</label>
              <div class="md:col-span-8">
                <select class="w-full py-2 px-3 border-2 border-gray-200 box-border md:-mb-52" id="sports_type" v-model="sports_type_selected" @change="getSportsDiscipline" >
                  <option disabled value="競技">1つを選択して下さい</option>
                  <option v-for="sports_type in sports_types" :key="sports_type.id" :value="sports_type">
                    {{ sports_type.name }}
                  </option>
                </select>
              </div>
            </li>
            <div class="error">{{ sports_type_selected_error }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="discipline" v-if="sports_disciplines.length > 0">種目</label>
              <div class="md:col-span-8">
                <select class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="discipline"  v-model="sports_discipline_selected" multiple v-if="sports_disciplines.length > 0">
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
                  <option v-for="prefecture in prefectures" :key="prefecture.id" :value="prefecture.id">
                    {{ prefecture.name }}
                  </option>
                </select>
              </div>
            </li>
            <div class="error">{{ prefecture_selected_error }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="event_name">チーム名</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="event_name" type="text" required placeholder="チーム名" v-model="event_name">
                <div v-if="remainingCharactersEventName <= 5" class="text-red-500">
                  チーム名はあと{{ remainingCharactersEventName }}文字までです。
                </div>
              </div>
            </li>
            <div class="error" v-for="(errMsg, index) in backend_errors.name" :key="index">{{ errMsg }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="area">活動地域</label>
              <div class="md:col-span-8">
                <textarea class="w-full h-40 py-2 px-3 border-2 border-gray-200 box-border" id="area" name="textarea" required placeholder="活動地域" v-model="area"></textarea>
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
                    <input type="radio" value="man" name="sex" v-model="sex" />男
                  </label>
                </div>
                <div class="md:-mx-3">
                  <label for="woman">
                    <input type="radio" value="woman" name="sex" v-model="sex" />女
                  </label>
                </div>
                <div class="md:-mx-3">
                  <label for="mix">
                    <input type="radio" value="mix" name="sex" v-model="sex" />男女
                  </label>
                </div>
                <div class="md:-mx-3">
                  <label for="man_and_woman">
                    <input type="radio" value="man_and_woman" name="sex" v-model="sex" />混合
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
            <div class="error">{{ target_age_selected_error }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="record">活度実績</label>
              <div class="md:col-span-8">
                <textarea class="w-full h-40 py-2 px-3 border-2 border-gray-200 box-border" name="textarea" v-model="track_record" id="record" required placeholder="track record"></textarea>
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="Other">その他</label>
              <div class="md:col-span-8">
                <textarea  class="w-full h-40 py-2 px-3 border-2 border-gray-200 box-border" name="textarea" v-model="other_body" id="Other" placeholder="Other"></textarea>
              </div>
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
import getApiClient from '@/lib/apiClient'

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
  computed: {
    remainingCharactersEventName() {
      const maxChars = 255;
      return maxChars - this.event_name.length;
    },
    remainingCharactersArea() {
      const maxChars = 255;
      return maxChars - this.area.length;
    }
  },
  methods: {
    selectedSports(){
      return this.sports_discipline_selected.length ? this.sports_discipline_selected.map(sport => sport.name).join(", ") : ''
    },
    targetAges(){
      return this.target_age_selected.length ? this.target_age_selected.map(age => age.name).join(", ") : ''
    },
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
        const apiClient = getApiClient()
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
        this.backend_errors = errors.response.data.error
      }
    },
    async getSportsType () {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get('/sports_types')
        this.sports_types = res.data.data
      } catch {
        this.errors.push('競技を表示できませんでした。')
      }
    },
    async getSportsDiscipline () {
      try {
        this.errors = []
        const apiClient = getApiClient()
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
        const apiClient = getApiClient()
        const res = await apiClient.get('/prefectures')
        this.prefectures = res.data.data
      } catch {
        this.errors.push('都道府県を表示できませんでした。')
      }
    },
    async getTargetAge () {
      try {
        this.errors = []
        const apiClient = getApiClient()
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
