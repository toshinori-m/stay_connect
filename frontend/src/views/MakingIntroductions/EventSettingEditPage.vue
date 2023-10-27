<template>
  <div class="flex items-center justify-center mt-32 xl:mt-20">
    <div class="xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">イベント編集</h2>
      <button class="cancel_button mx-5 float-right" @click="EventSettingEditCancel">戻る</button>
      <div class="my-10">
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
        <form class= "text-center" @submit.prevent="editEventSetting(recruitments.id)">
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
                <option v-for="prefecture in prefectures" :key="prefecture.id" :value="prefecture.id" >
                  {{ prefecture.name }}
                </option>
              </select>
            </li>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 xl:mr-4 xl:ml-3" for="event_url">イベントURL</label>
              <input class="xl:place-self-center mx-6 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="event_url" type="url" placeholder="http://" v-model="recruitments.event_url">
            </li>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 ml-4" for="name">イベント名</label>
              <input class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="name" type="text" v-model="recruitments.name">
            </li>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start xl:mt-3 ml-6 mr-8" for="area">地域</label>
              <textarea class="xl:place-self-center mx-10 text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" id="area" name="textarea" required placeholder="地域" v-model="recruitments.area"></textarea>
            </li>
            <li class="xl:grid grid-cols-6 gap-6 items-end mb-2.5 items-center xl:my-4">
              <label class="xl:place-self-start  xl:mt-1 xl:mr-1 mx-4">性別</label>
              <label for="man">
                <input type="radio" id="man" value="man" name="sex" v-model="recruitments.sex" />男
              </label>
              <label for="woman">
                <input type="radio" id="woman" value="woman" name="sex" v-model="recruitments.sex" />女
              </label>
              <label for="mix">
                <input type="radio" id="mix" value="mix" name="sex" v-model="recruitments.sex" />男女
              </label>
              <label for="man_and_woman">
                <input type="radio" id="man_and_woman" value="man_and_woman" name="sex" v-model="recruitments.sex" />混合
              </label>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md" type="text">{{ recruitments.sex }}</div>
            <div v-if="backend_errors.sex" class="error">{{ backend_errors.sex[0] }}</div>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start xl:mt-3 mx-4" for="target_age">対象年齢</label>
              <select class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="target_age" v-model="target_age_selected" multiple>
                <option disabled value="">選択して下さい</option>
                <option v-for="target_age in target_ages" :key="target_age.id" :value="target_age">
                  {{ target_age.name }}
                </option>
              </select>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md">{{ target_age_selected.length ? target_age_selected.map(sport => sport.name).join(", ") : '' }}</div>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start  xl:mt-3 mx-4" for="start_date">開始日付</label>
              <input v-if="recruitments" class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="start_date" type="date" v-model="recruitments.start_date">
              <div v-if="backend_errors.start_date" class="error">{{ backend_errors.start_date[0] }}</div>
            </li>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start  xl:mt-3 mx-4" for="end_date">終了日付</label>
              <input class="xl:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="end_date" type="date" v-model="recruitments.end_date">
              <div v-if="backend_errors.end_date" class="error">{{ backend_errors.end_date[0] }}</div>
            </li>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="xl:place-self-start  xl:mt-3 mx-4" for="number">募集チーム数</label>
              <input class="xl:place-self-center sm:mr-10 sm:ml-3 xl:mr-4 xl:ml-3 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="number" type="number" required placeholder="募集チーム数" v-model="recruitments.number">
            </li>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start  xl:mt-3 mx-4" for="Purpose">イベント目的</label>
              <textarea class="xl:place-self-center text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" name="textarea" v-model="recruitments.purpose_body" id="Purpose" required placeholder="Event Purpose"></textarea>
            </li>
            <li class="xl:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="xl:place-self-start  xl:mt-3 mx-5" for="Other">その他</label>
              <textarea  class="xl:place-self-center mx-10 text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" name="textarea" v-model="recruitments.other_body" id="Other" placeholder="Other"></textarea>
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
import axios from 'axios';
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
  methods: {
    async getEventSettingEdit() {
      try {
        this.errors = []
        const recruitmentId = this.$route.params.id;
        const res = await axios.get(`http://localhost:3001/recruitments/${recruitmentId}`, {
          'access-token': localStorage.getItem('access-token'),
          client: localStorage.getItem('client'),
          uid: localStorage.getItem('uid')
        })
        this.recruitments = res.data.data
        const rdsRes = await axios.get(`http://localhost:3001/recruitment_sports_disciplines?recruitment_id=${recruitmentId}`);
        this.recruitment_sports_disciplines = rdsRes.data;
        const rtaRes = await axios.get(`http://localhost:3001/recruitment_target_ages?recruitment_id=${recruitmentId}`);
        this.recruitment_target_ages = rtaRes.data;
        this.getSportsType()
        this.getPrefectures()
        this.getTargetAge()
      } catch (error) {
        this.errors.push('イベントを表示できませんでした。')
      }
    },
    async getSportsType () {
      try {
        this.errors = []
        const res = await axios.get('http://localhost:3001/sports_types', {
          headers: {
          uid: window.localStorage.getItem('uid'),
          "access-token": window.localStorage.getItem('access-token'),
          client: window.localStorage.getItem('client')
          }
        })
        this.sports_types = res.data.data
        const sportsTypeId = this.recruitments.sports_type_id;
        this.sports_type_selected = this.sports_types.find(st => st.id === sportsTypeId);
        this.getSportsDiscipline();
      } catch (error) {
        this.errors.push('競技を表示できませんでした。')
      }
    },
    async getSportsDiscipline() {
      try {
        this.errors = []
        const res = await axios.get('http://localhost:3001/sports_disciplines', {
          params: {
            sports_type_id: this.sports_type_selected.id
          },
          headers: {
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid')
          }
        })
        this.sports_disciplines = res.data.data
        this.sports_discipline_selected = this.recruitment_sports_disciplines.map(rsd => 
        this.sports_disciplines.find(sd => sd.id === rsd.sports_discipline_id)).filter(Boolean);
      } catch (error) {
        this.errors.push('種目を選択していません。')
      }
    },
    async getPrefectures () {
      try {
        this.errors = []
        const res = await axios.get('http://localhost:3001/prefectures', {
          headers: {
            uid: window.localStorage.getItem('uid'),
            "access-token": window.localStorage.getItem('access-token'),
            client: window.localStorage.getItem('client')
          }
        })
        this.prefectures = res.data.data
        this.prefecture_selected = this.recruitments.prefecture_id;
      } catch (error) {
        this.errors.push('都道府県を表示できませんでした。')
      }
    },
    async getTargetAge () {
      try {
        this.errors = []
        const res = await axios.get('http://localhost:3001/target_ages', {
          headers: {
            uid: window.localStorage.getItem('uid'),
            "access-token": window.localStorage.getItem('access-token'),
            client: window.localStorage.getItem('client')
          }
        })
        this.target_ages = res.data.data
        this.target_age_selected = this.recruitment_target_ages.map(rta => 
        this.target_ages.find(ta => ta.id === rta.target_age_id)).filter(Boolean);
      } catch (error) {
        this.errors.push('対象年齢を表示できませんでした。')
      }
    },
    async editEventSetting(recruitmentId) {
      try {
        this.errors = []
        const disciplineIds = this.sports_discipline_selected.map(discipline => discipline.id);
        const targetAgeIds = this.target_age_selected.map(target => target.id);
        const recruitment = this.recruitments;
        if (!recruitment) return;
        if (recruitment.id !== recruitmentId) return;
        await axios.patch(`http://localhost:3001/recruitments/${recruitmentId}`, {
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
          target_age_ids: targetAgeIds,
        }, {
          headers: {
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid')
          }
        })
        this.$router.push({ name: 'EventSettingListPage' })
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors.push(...Object.values(error.response.data.errors));
        } else {
          this.errors.push('イベントに誤りがあります。');
        }
      }
    },
    async deleteEventSetting(recruitmentId) {
      try {
        this.errors = []
        if (this.recruitments.id !== recruitmentId) return;
        await axios.delete(`http://localhost:3001/recruitments/${recruitmentId}`, {
          data: {
            'access-token': localStorage.getItem('access-token'),
            client: localStorage.getItem('client'),
            uid: localStorage.getItem('uid')
          }
        })
        this.$router.push({ name: 'EventSettingListPage' })
      } catch (error) {
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
