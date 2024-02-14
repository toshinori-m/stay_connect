<template>
  <div class="flex items-center justify-center mt-32 md:mt-20">
    <div class="w-full md:w-3/5 xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <div class="relative text-center pt-10 pb-10 flex flex-col items-center">
        <h2 class="inline-block font-bold text-3xl text-blue-600">基本設定編集</h2>
        <button class="cancel_button sm:absolute sm:right-0 sm:top-0 sm:mt-10 sm:mr-6 relative mt-4 mx-auto" @click="BasicSettingEditCancel">戻る</button>
      </div>
      <div class="px-4 md:px-0">
        <form class= "text-center" @submit.prevent="basicSettingEdit">
          <ul class="space-y-8 mb-3">
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="name">名前</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="name" type="text" required placeholder="名前" v-model="user.name">
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center mt-28">
              <label class="md:col-span-4 text-left px-3 py-2" for="icon">アイコン</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="icon" type="file" @change="setImage($event)">
              </div>
            </li>
            <img class="mx-auto w-72 text-gray-400" :src="user.image_url" alt="アイコンのイメージ">
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center mt-40">
              <label class="md:col-span-4 text-left px-3 py-2" for="birthday">誕生日</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="birthday" type="date" required placeholder="誕生日" v-model="user.birthday">
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2">性別</label>
              <div class="md:col-span-8">
                <label class="mx-3" for="man">
                  <input class="mx-3" type="radio" id="man" value="man" name="sex" v-model="user.sex" />男
                </label>
                <label class="mx-3" for="woman">
                  <input class="mx-3" type="radio" id="woman" value="woman" name="sex" v-model="user.sex" />女
                </label>
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="email">メールアドレス</label>
              <div class="md:col-span-8">
                <input class="w-full py-2 px-3 border-2 border-gray-200 box-border" id="email" type="email" required placeholder="メールアドレス" v-model="user.email">
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="email">パスワード</label>
              <div class="md:col-span-8">
                <button class="xl:place-self-center py-1 px-1 my-2 bg-sky-500 hover:bg-sky-700 text-white rounded-lg" @click="redirectToSendEmail">（変更する）</button>
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="self_introduction">自己紹介</label>
              <div class="md:col-span-8">
                <textarea class="w-full h-40 py-2 px-3 border-2 border-gray-200 box-border" id="self_introduction" type="text" required placeholder="自己紹介" v-model="user.self_introduction"></textarea>
              </div>
            </li>
            <li class="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <label class="md:col-span-4 text-left px-3 py-2" for="email_notification">メール通知</label>
              <div class="md:col-span-8">
                <input class="xl:place-self-center border-gray-200 box-border" id="email_notification" type="checkbox" :checked="user.email_notification === 'receives'" @change="toggleEmailNotification">
                <label class="xl:ml-5 mt-1" for="email_notification">{{ user.email_notification ? '受信する' : '受信しない' }}</label>
              </div>
            </li>
            <div class="error text-sm text-red-400">{{ error }}</div>
            <button class="update_button mx-5">更新</button>
          </ul>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import getApiClient from '@/lib/apiClient'
import { mapActions, mapGetters } from "vuex"

export default {
  data() {
    return {
      user: {},
      imageFile: null,
      email_notification: 'receives',
      error: null
    }
  },
  computed: {
    ...mapGetters("posts", ["posts"])
  },
  methods: {
    async getBasicSettingEdit() {
      try {
        const apiClient = getApiClient()
        this.error = null
        const uid = JSON.parse(localStorage.getItem('currentUser')).uid
        const res = await apiClient.get(`/users/${uid}`)
        this.user = res.data.data
      } catch {
        this.$router.push({name: 'LoginPage'})
      }
    },
    async basicSettingEdit() {
      try {
        const apiClient = getApiClient()
        this.error = null
        const formData = new FormData()
        formData.append('user[name]', this.user.name)
        formData.append('user[email]', this.user.email)
        formData.append('user[birthday]', this.user.birthday)
        formData.append('user[sex]', this.user.sex)
        formData.append('user[email_notification]', this.user.email_notification)
        if (this.user.self_introduction) {
          formData.append('user[self_introduction]', this.user.self_introduction);
        }
        if (this.imageFile) {
          formData.append('user[image]', this.imageFile);
        }
        if (!this.user || !this.user.id) return
        await apiClient.patch(`/users/${this.user.id}`, formData)
        this.$router.push({ name: 'HomePage' })
      } catch {
        this.error = '基本設定に誤りがあります。'
      }
    },
    ...mapActions("posts", ["createPost"]),
    setImage(event) {
      const file = event.target.files[0]
      if (file) {
        this.imageFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.user.image_url = e.target.result
        }
        reader.readAsDataURL(this.imageFile)
      }
    },
      toggleEmailNotification(event) {
      this.user.email_notification = event.target.checked ? 'receives' : 'not_receive'
    },
    redirectToSendEmail() {
      this.$router.push({name: 'SendEmailPage'})
    },
    BasicSettingEditCancel() {
      this.$router.push({name: 'HomePage'})
    }
  },
  mounted() {
    this.getBasicSettingEdit()
  }
}
</script>
