<template>
  <div class="flex items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1">イベント一覧</h2>
      <button class="cancel_button mx-5 float-right" @click="EventSettingCancel">戻る</button>
      <div class="my-14">
        <div class="error text-sm text-red-400">{{ error }}</div>
        <div class="text-left my-3 sm:ml-4 sm:mr-6 w-72 pt-3 ring-offset-2 ring-2 rounded-lg break-words" type="text" v-for="recruitment in recruitments" :key="recruitment.id">イベント名:
          {{ recruitment.name }}
          <div class="flex justify-center">
            <button class="update_button" @click="editRecruitment(recruitment.id)">更新</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'

export default {
  data() {
    return {
      recruitments: [],
      error: null
    }
  },
  methods: {
    async getRecruitment() {
      try {
        const apiClient = getApiClient()
        this.error = null
        const res = await apiClient.get('/recruitments')
        this.recruitments = res.data.data
      } catch {
      this.error = '競技名を表示できませんでした。'
      }
    },
    async editRecruitment(recruitmentId) {
      this.$router.push({name: 'EventSettingEditPage', params: {id: recruitmentId} });
    },
    EventSettingCancel() {
      this.$router.push({name: 'HomePage'})
    }
  },
  mounted() {
    this.getRecruitment()
  }
}
</script>
