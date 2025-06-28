<template>
  <div class="flex items-center justify-center mt-32 md:mt-20">
    <div class="w-full md:w-3/5 xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <button class="cancel_button mx-5 mt-8 float-right" @click="EventSettingEditCancel">戻る</button>
      <h2 class="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">イベント編集</h2>
      <div class="px-4 md:px-0">
        <form class= "text-center" @submit.prevent="editEventSetting(recruitments.id)">
          <ul class="space-y-4">
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
              <label class="md:col-span-4 text-left px-3 py-2" for="event_url">イベントURL</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="event_url" type="url" placeholder="https://www.example.com/images/example.jpg" v-model="recruitments.event_url">
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="name">イベント名</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="name" type="text" v-model="recruitments.name">
                <div v-if="remainingCharactersEventName <= 5" class="text-red-500">
                  地域はあと{{ remainingCharactersEventName }}文字までです。
                </div>
              </div>
            </li>
            <div class="error" v-for="(errMsg, index) in backend_errors.name" :key="index">{{ errMsg }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="area">地域</label>
              <div class="md:col-span-8">
                <textarea class="w-full h-32 py-2 px-3 border-2 border-gray-200 box-border" id="area" name="textarea" required placeholder="地域" v-model="recruitments.area"></textarea>
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
                    <input type="radio" value="man" name="sex" v-model="recruitments.sex" />男
                  </label>
                </div>
                <div class="md:-mx-3">
                  <label for="woman">
                    <input type="radio" value="woman" name="sex" v-model="recruitments.sex" />女
                  </label>
                </div>
                <div class="md:-mx-1">
                  <label for="mix">
                    <input type="radio" value="mix" name="sex" v-model="recruitments.sex" />男女
                  </label>
                </div>
                <div class="md:-ml-2">
                  <label for="man_and_woman">
                    <input type="radio" value="man_and_woman" name="sex" v-model="recruitments.sex" />混合
                  </label>
                </div>
              </div>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md" type="text">{{ recruitments.sex }}</div>
            <div class="error" v-for="(errMsg, index) in backend_errors.sex" :key="index">{{ errMsg }}</div>
            <div class="md:-mb-16">
              <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <label class="md:col-span-4 text-left px-3 py-2" for="target_age">対象年齢</label>
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
              <label class="md:col-span-4 text-left px-3 py-2" for="start_date">開始日付</label>
              <div class="md:col-span-8">
                <input v-if="recruitments" class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="start_date" type="date" v-model="recruitments.start_date">
              </div>
            </li>
            <div class="error" v-for="(errMsg, index) in backend_errors.start_date" :key="index">{{ errMsg }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="end_date">終了日付</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="end_date" type="date" v-model="recruitments.end_date">
              </div>
            </li>
            <div class="error" v-for="(errMsg, index) in backend_errors.end_date" :key="index">{{ errMsg }}</div>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="number">募集チーム数</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="number" type="number" required placeholder="募集チーム数" v-model="recruitments.number">
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="Purpose">イベント目的</label>
              <div class="md:col-span-8">
                <textarea class="w-full h-32 py-2 px-3 border-2 border-gray-200 box-border" name="textarea" v-model="recruitments.purpose_body" id="Purpose" required placeholder="イベント目的"></textarea>
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="Other">その他</label>
              <div class="md:col-span-8">
                <textarea  class="w-full h-32 py-2 px-3 border-2 border-gray-200 box-border" name="textarea" v-model="recruitments.other_body" id="Other" placeholder="その他"></textarea>
              </div>
            </li>
            <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
            <button class="update_button mx-5">更新</button>
            <button type="button" class="delete_button mx-5" @click="deleteEventSetting(recruitments.id)">削除</button>
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
      recruitments: { start_date: "2023-01-01" },
      recruitment_sports_disciplines: [],
      recruitment_target_ages: [],
      sports_type_selected: null,
      sports_discipline_selected: [],
      prefecture_selected: null,
      sports_types: [],
      sports_disciplines: [],
      prefectures: [],
      target_age_selected: [],
      target_ages: [],
      event_url: "",
      name: "",
      area: "",
      sex: "",
      number: null,
      start_date: "",
      end_date: "",
      purpose_body: "",
      other_body: "",
      errors: [],
      backend_errors: ""
    }
  },
  computed: {
    remainingCharactersEventName() {
      if(!this.recruitments.name) return 0
      const maxChars = 255
      const nameLength = this.recruitments.name.length ?? 0
      return maxChars - nameLength
    },
    remainingCharactersArea() {
      if(!this.recruitments.area) return 0
      const maxChars = 255
      const areaLength = this.recruitments.area.length ?? 0
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
    async getEventSettingEdit() {
      try {
        const apiClient = getApiClient()
        this.errors = []
        const recruitmentId = this.$route.params.id;
        const res = await apiClient.get(`/recruitments/${recruitmentId}`, {
          withCredentials: true
        })
        this.recruitments = res.data.data
        const rdsRes = await apiClient.get(`/recruitments/${recruitmentId}/sports_disciplines`)
        this.recruitment_sports_disciplines = rdsRes.data
        const rtaRes = await apiClient.get(`/recruitments/${recruitmentId}/target_ages`)
        this.recruitment_target_ages = rtaRes.data
        this.getSportsType()
        this.getPrefectures()
        this.getTargetAge()
      } catch {
        this.errors.push('イベントを表示できませんでした。')
      }
    },
    async getSportsType() {
      try {
        const apiClient = getApiClient()
        this.errors = []
        const res = await apiClient.get('/sports_types')
        this.sports_types = res.data.data
        const sportsTypeId = this.recruitments.sports_type_id
        this.sports_type_selected = this.sports_types.find(st => st.id === sportsTypeId)
        this.getSportsDiscipline()
      } catch {
        this.errors.push('競技を表示できませんでした。')
      }
    },
    async getSportsDiscipline() {
      try {
        const apiClient = getApiClient()
        this.errors = []
        const res = await apiClient.get('/sports_disciplines', {
          params: {
            sports_type_id: this.sports_type_selected.id
          }
        })
        this.sports_disciplines = res.data.data
        this.sports_discipline_selected = this.recruitment_sports_disciplines.map(rsd => 
        this.sports_disciplines.find(sd => sd.id === rsd.sports_discipline_id)).filter(Boolean);
      } catch {
        this.errors.push('種目を選択していません。')
      }
    },
    async getPrefectures () {
      try {
        const apiClient = getApiClient()
        this.errors = []
        const res = await apiClient.get('/prefectures')
        this.prefectures = res.data.data
        this.prefecture_selected = this.recruitments.prefecture_id;
      } catch {
        this.errors.push('都道府県を表示できませんでした。')
      }
    },
    async getTargetAge() {
      try {
        const apiClient = getApiClient()
        this.errors = []
        const res = await apiClient.get('/target_ages')
        this.target_ages = res.data.data
        this.target_age_selected = this.recruitment_target_ages.map(rta => 
        this.target_ages.find(ta => ta.id === rta.target_age_id)).filter(Boolean);
      } catch {
        this.errors.push('対象年齢を表示できませんでした。')
      }
    },
    async editEventSetting(recruitmentId) {
      try {
        const apiClient = getApiClient()
        this.errors = []
        const disciplineIds = this.sports_discipline_selected.map(discipline => discipline.id);
        const targetAgeIds = this.target_age_selected.map(target => target.id);
        const recruitment = this.recruitments;
        if (!recruitment) return;
        if (recruitment.id !== recruitmentId) return;
        await apiClient.patch(`/recruitments/${recruitmentId}`, {
          recruitment:{
            image: this.recruitments.event_url,
            name: this.recruitments.name,
            area: this.recruitments.area,
            sex: this.recruitments.sex,
            number: this.recruitments.number,
            start_date: this.recruitments.start_date,
            end_date: this.recruitments.end_date,
            purpose_body: this.recruitments.purpose_body,
            other_body: this.recruitments.other_body,
            sports_type_id: this.sports_type_selected.id,
            sports_discipline_ids: disciplineIds,
            prefecture_id: this.prefecture_selected,
            target_age_ids: targetAgeIds
          }
        }, {
          withCredentials: true
        })
        this.$router.push({ name: 'EventSettingListPage' })
      } catch (error) {
        this.backend_errors = error.response.data.error
      }
    },
    async deleteEventSetting(recruitmentId) {
      try {
        const apiClient = getApiClient()
        this.errors = []
        if (this.recruitments.id !== recruitmentId) return
        await apiClient.delete(`/recruitments/${recruitmentId}`, {
          withCredentials: true
        })
        this.$router.push({ name: 'EventSettingListPage' })
      } catch {
        this.errors.push('イベントを削除出来ませんでした。')
      }
    },
    EventSettingEditCancel() {
      this.$router.push({name: 'HomePage'})
    }
  },
  mounted() {
    this.getEventSettingEdit()
  }
}
</script>
