<template>
  <div class="flex items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1">都道府県名編集</h2>
        <button class="cancel_button mx-5 float-right" @click="prefectureCancel">戻る</button>
        <div class="my-10">
          <div class="error text-sm text-red-400">{{ error }}</div>
        <div class="rounded-2xl mt-2 mx-auto py-2 px-3 sm:w-4/5 md:w-3/4" v-for="prefecture in prefectures" :key="prefecture.id">
          <form class= "prefecture text-center" @submit.prevent="editPrefecture(prefecture.id)">
            <input class="sm:ml-4 sm:mr-6 py-3 px-3 w-72 border-2 border-gray-200 box-border" type="text" v-model="prefecture.name">
            <ul class="flex items-center justify-evenly">
              <li><button class="update_button">更新</button>
              </li>
              <li><button class="delete_button" @click="deletePrefecture(prefecture.id)">削除</button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import getItem from '@/auth/getItem'

export default {
  data() {
    return {
      prefectures: [],
      error: null
    }
  },
  methods: {
    async getPrefecture() {
      try {
        this.error = null
        const res = await axios.get(`http://localhost:3001/prefectures/`, {
          headers: getItem
        })
        this.prefectures = res.data.data
      } catch {
      this.error = '競技名を表示できませんでした。'
      }
    },
    async editPrefecture(prefectureId) {
      try {
        this.error = null
        const prefecture = this.prefectures.find(prefecture => prefecture.id === prefectureId);
        if (!prefecture) return;
        await axios.patch(`http://localhost:3001/prefectures/${prefectureId}`, {
          name: prefecture.name,
        }, {
          headers: getItem
        })
        this.$router.push({ name: 'PrefecturePage' })
      } catch {
        this.error = '競技名に誤りがあります。'
      }
    },
    async deletePrefecture(prefectureId) {
      try {
        this.error = null
        await axios.delete(`http://localhost:3001/prefectures/${prefectureId}`, {
          headers: getItem
        })
        this.$router.push({ name: 'PrefecturePage' })
      } catch {
        this.error = '競技名を削除出来ませんでした。'
      }
    },
    prefectureCancel () {
      this.$router.push({name: 'PrefecturePage'})
    }
  },
  mounted() {
    this.getPrefecture()
  }
}
</script>
