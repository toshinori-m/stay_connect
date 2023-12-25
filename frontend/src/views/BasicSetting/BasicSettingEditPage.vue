<template>
  <div class="flex items-center justify-center mt-32 xl:mt-20">
    <div class="xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">基本設定編集</h2>
      <button class="cancel_button mx-5 float-right" @click="BasicSettingEditCancel">戻る</button>
      <div class="my-10">
        <form class= "text-center" @submit.prevent="basicSettingEdit">
          <ul>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="sm:float-left xl:mt-3 ml-28 sm:ml-6 sm:mt-3 xl:mr-20 xl:-ml-2" for="name">名前</label>
              <input class="xl:place-self-center float-center py-1 px-1 my-2 w-72 xl:ml-28 border-2 border-gray-200 box-border" id="name" type="text" required placeholder="名前" v-model="user.name">
            </li>
            <li class="xl:grid grid-cols-3 gap-4 mt-2">
              <label class="xl:place-self-start xl:mt-3 xl:mr-4 xl:ml-3" for="icon">アイコン</label>
              <input class="xl:place-self-center mx-6 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="icon" type="file" @change="setImage($event)">
            </li>
            <img class="text-gray-400" :src="user.image_url" alt="アイコンのイメージ">
            <li class="xl:grid grid-cols-3 gap-4 mt-5">
              <label class="sm:float-left sm:mt-4 sm:ml-7 sm:-mr-4 xl:mt-3 xl:mr-20 xl:ml-1 xl:mr-24 mx-2" for="birthday">誕生日</label>
              <input class="xl:place-self-center mx-6 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="birthday" type="date" required placeholder="誕生日" v-model="user.birthday">
            </li>
            <li class="xl:grid grid-cols-4 gap-4 items-end mb-2.5 items-center my-4">
              <label class="float-left ml-4 sm:ml-7 xl:ml-1 xl:mr-16 mt-1">性別</label>
              <label class="mx-3" for="man">
                <input class="mx-3" type="radio" id="man" value="man" name="sex" v-model="user.sex" />男
              </label>
              <label class="mx-3" for="woman">
                <input class="mx-3" type="radio" id="woman" value="woman" name="sex" v-model="user.sex" />女
              </label>
              <label v-if="user.sex" class="px-2 py-1 mx-5 bg-white rounded-md" type="text">{{ user.sex }}
              </label>
            </li>
            <li class="xl:grid grid-cols-3 gap-4 mt-6">
              <label class="xl:place-self-start xl:mt-3 xl:mr-4 xl:ml-5" for="email">メールアドレス</label>
              <input class="xl:place-self-center py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="email" type="email" required placeholder="メールアドレス" v-model="user.email">
            </li>
            <li class="grid grid-cols-3 gap-4 mt-6">
              <label class="place-self-start mt-3 ml-5" for="email">パスワード</label>
              <button class="place-self-center  py-1 px-1 my-2 bg-sky-500 hover:bg-sky-700 text-white rounded-lg" @click="redirectToSendEmail">（変更する）</button>
            </li>
            <li class="xl:grid grid-cols-3 gap-4 mt-6">
              <label class="xl:place-self-start xl:mt-5 sm:ml-5" for="self_introduction">自己紹介</label>
              <textarea class="xl:place-self-center mx-6 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="self_introduction" type="text" required placeholder="自己紹介" v-model="user.self_introduction"></textarea>
            </li>
            <li class="xl:grid grid-cols-3 gap-4 mt-6">
              <label class="xl:place-self-start -ml-32 sm:-ml-36 sm:mr-20 mr-12 xl:mr-6 xl:ml-5" for="email_notification">メール通知</label>
              <input class="xl:place-self-center border-gray-200 box-border" id="email_notification" type="checkbox" :checked="user.email_notification === 'receives'" @change="toggleEmailNotification">
              <label class="xl:mr-36 xl:-ml-36 mt-1" for="email_notification">{{ user.email_notification ? '受信する' : '受信しない' }}</label>
            </li>
            <div class="error text-sm text-red-400">{{ error }}</div>
            <button class="update_button mx-5 mt-7">更新</button>
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
