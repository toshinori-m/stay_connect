<template>
  <div class="flex items-center justify-center mt-36">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">種目名作成</h2>
      <form class= "text-center" @submit.prevent="sports_discipline">
        <div class="mt-10 mb-1 xl:text-left xl:grid grid-cols-3 gap-4">
          <label class="xl:mt-3 xl:mx-auto ml-4 mr-10" for="type">競技</label>
          <select class="xl:place-self-center py-2 px-1 my-2 w-72 border-2 border-gray-200 box-border" v-model="selected" id="type">
            <option disabled value="">1つを選択して下さい</option>
            <option v-for="sports_type in sports_types" :key="sports_type.id" :value="sports_type.id">
              {{ sports_type.name }}
            </option>
          </select>
        </div>
        <p>id = {{selected}}</p>
        <div class="my-10 xl:text-left xl:grid grid-cols-3 gap-4">
          <label class="xl:mt-3 xl:ml-16 ml-4 mr-7" for="discipline">種目名</label>
          <input class="xl:place-self-center py-2 px-1 my-2 w-72 border-2 border-gray-200 box-border" type="text" id="discipline" required placeholder="種目名" v-model="name">
        </div>
        <div class="error text-sm text-red-400">{{ error }}</div>
        <button class="ok_button mb-5 mx-5">登録</button>
        <button class="update_button mb-5 mx-5" @click="sports_discipline_update">編集</button>
        <button class="cancel_button mb-10 mx-5" @click="sports_discipline_cancel">戻る</button>
      </form>
    </div>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      selected: '',
      sports_types: [],
      name: "",
      error: null
    }
  },
  methods: {
    async getSportsType() {
      try {
        const apiClient = getApiClient()
        this.error = null
        const res = await apiClient.get('/sports_types')
        this.sports_types = res.data.data
      } catch {
        this.error = '競技を表示できませんでした。競技を選択して下さい。'
      }
    },
    async sports_discipline() {
      try {
        const apiClient = getApiClient()
        this.error = null
        await apiClient.post('/sports_disciplines', {
          sports_type_id: this.selected,
          name: this.name
        }, {
          withCredentials: true
        })
        this.$router.push({ name: 'EventSettingPage' })
      } catch {
        this.error = '種目名に誤りがあります。'
      }
    },
    sports_discipline_cancel() {
      this.$router.push({name: 'EventSettingPage'})
    },
    sports_discipline_update() {
      this.$router.push({name: 'SportsDisciplineEditPage'})
    }
  },
  mounted() {
    this.getSportsType()
  }
}
</script>
