<template>
  <div class="flex items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1">イベント編集</h2>
      <button class="cancel_button mx-5 float-right" @click="EventSettingEditCancel">戻る</button>
      <div class=" my-10">
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
        <form class= "text-center" @submit.prevent="editTargetAge(target_age.id)">
          <ul>
            <li class="md:grid grid-cols-3 gap-4">
              <label class="md:place-self-start mr-16 xl:mr-1 md:mt-3" for="sports_type">競技名</label>
              <select class="md:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="sports_type" v-model="sports_type_selected">
                <option disabled value="競技">1つを選択して下さい</option>
                <option v-for="sports_type in sports_types" :key="sports_type.id" :value="sports_type">
                  {{ sports_type.name }}
                </option>
              </select>
              <div class="error">{{ sports_type_selected_error }}</div>
            </li>
            <li class="md:grid grid-cols-3 gap-4">
              <label class="md:place-self-start md:mt-3 mx-4" for="discipline" v-if="sports_disciplines.length > 0">種目</label>
              <select class="md:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="discipline"  v-model="sports_discipline_selected" multiple v-if="sports_disciplines.length > 0">
                <option v-for="sports_discipline in sports_disciplines" :key="sports_discipline.id" :value="sports_discipline">
                  {{ sports_discipline.name }}
                </option>
              </select>
            </li>
            <div class="mb-5 mx-5 bg-white rounded-md">{{ sports_discipline_selected.length ? sports_discipline_selected.map(sport => sport.name).join(", ") : '' }}</div>
            <li class="md:grid grid-cols-3 gap-4">
              <label class="md:place-self-start md:mt-3 mx-4" for="prefecture">都道府県</label>
              <select class="md:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="prefecture"  v-model="prefecture_selected">
                <option disabled value="">1つを選択して下さい</option>
                <option v-for="prefecture in prefectures" :key="prefecture.id" :value="prefecture.id" >
                  {{ prefecture.name }}
                </option>
              </select>
              <div class="error">{{ prefecture_selected_error }}</div>
            </li>
            <li class="md:grid grid-cols-3 gap-4">
              <label class="md:place-self-start md:mt-3 ml-4" for="event_url">イベントURL</label>
              <input class="md:place-self-center mx-10 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="event_url" type="url" placeholder="http://" v-model="recruitments.event_url">
            </li>
            <li class="md:grid grid-cols-3 gap-4">
              <label class="md:place-self-start mr-16 xl:mr-1 md:mt-3" for="name">イベント名</label>
              <input class="sm:ml-4 sm:mr-6 py-1 px-3 w-72 border-2 border-gray-200 box-border" id="name" type="text" v-model="recruitments.name">
            </li>
            <li class="md:grid grid-cols-3 gap-4 sm:flex sm:items-center">
              <label class="md:place-self-start md:mt-3 ml-6 mr-8" for="area">地域</label>
              <textarea class="md:place-self-center mx-10 text-start py-1 px-1 my-2 w-72 h-40 border-2 border-gray-200 box-border" id="area" name="textarea" required placeholder="地域" v-model="recruitments.area"></textarea>
            </li>
            <!-- <button class="update_button">更新</button>
            <button class="delete_button" @click="deleteTargetAge(target_age.id)">削除</button> -->
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
      recruitments: {},
      recruitment_sports_disciplines: [],
      sports_type_selected: null,
      sports_discipline_selected: [],
      prefecture_selected: null,
      sports_types: [],
      sports_disciplines: [],
      prefectures: [],
      errors: []
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
        console.log("recruitments.res", { res })
        const rdsRes = await axios.get(`http://localhost:3001/recruitment_sports_disciplines?recruitment_id=${recruitmentId}`);
        console.log("response_data:", rdsRes.data); 
        this.recruitment_sports_disciplines = rdsRes.data;
        console.log("recruitmentId:", recruitmentId);
        this.getSportsType()
        this.getPrefectures()
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
        console.log({ res })
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
        console.log({ res })
        console.log("this.recruitment_sports_disciplines:",this.recruitment_sports_disciplines)
        console.log("this.sports_discipline_selected:",this.sports_discipline_selected)
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
        console.log("prefectures.res",{ res })
        this.prefecture_selected = this.recruitments.prefecture_id;
      } catch (error) {
        this.errors.push('都道府県を表示できませんでした。')
      }
    },
    // async getTargetAge () {
    //   try {
    //     this.errors = []
    //     const res = await axios.get('http://localhost:3001/target_ages', {
    //       headers: {
    //       uid: window.localStorage.getItem('uid'),
    //       "access-token": window.localStorage.getItem('access-token'),
    //       client: window.localStorage.getItem('client')
    //       }
    //     })
    //     this.target_ages = res.data.data
    //   } catch (error) {
    //     this.errors.push('対象年齢を表示できませんでした。')
    //   }
    // },
    // async editTargetAge(targetAgeId) {
    //   try {
    //     this.errors = []
    //     const targetAge = this.target_ages.find(target_age => target_age.id === targetAgeId);
    //     if (!targetAge) return;
    //     await axios.patch(`http://localhost:3001/target_ages/${targetAgeId}`, {
    //       name: targetAge.name,
    //       'access-token': localStorage.getItem('access-token'),
    //       client: localStorage.getItem('client'),
    //       uid: localStorage.getItem('uid')
    //     })
    //     // this.$router.push({ name: 'EventSettingEditPage' })
    //   } catch (error) {
    //     this.errors.push('イベントに誤りがあります。')
    //   }
    // },
    // async deleteTargetAge(targetAgeId) {
    //   try {
    //     this.errors = []
    //     await axios.delete(`http://localhost:3001/target_ages/${targetAgeId}`, {
    //       data: {
    //         'access-token': localStorage.getItem('access-token'),
    //         client: localStorage.getItem('client'),
    //         uid: localStorage.getItem('uid')
    //       }
    //     })
    //     // this.$router.push({ name: 'EventSettingEditPage' })
    //   } catch (error) {
    //     this.errors.push('対象年齢を削除出来ませんでした。')
    //   }
    // },
    EventSettingEditCancel() {
      this.$router.push({name: 'EventSettingEditPage'})
    }
  },
  mounted() {
    this.getEventSettingEdit()
    // this.getTargetAge()
  }
}
</script>
