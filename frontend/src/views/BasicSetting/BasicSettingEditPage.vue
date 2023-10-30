<template>
  <div class="flex items-center justify-center mt-32 xl:mt-20">
    <div class="xl:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600">基本設定編集</h2>
      <button class="cancel_button mx-5 float-right" @click="BasicSettingEditCancel">戻る</button>
      <div class="my-10">
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in error" :key="index">{{ errMsg }}</div>
        <form class= "text-center" @submit.prevent="basicSettingEdit(user.id)">
          <ul>
            <li class="xl:grid grid-cols-3 gap-4">
              <label class="sm:float-left xl:mt-3 ml-28 sm:ml-6 sm:mt-3 xl:mr-20 xl:-ml-2" for="name">名前</label>
              <input class="xl:place-self-center float-center py-1 px-1 my-2 w-72 xl:ml-28 border-2 border-gray-200 box-border" id="name" type="text" required placeholder="名前" v-model="user.name">
            </li>
            <li class="xl:grid grid-cols-3 gap-4 mt-2">
              <label class="xl:place-self-start xl:mt-3 xl:mr-4 xl:ml-3" for="icon">アイコン</label>
              <input class="xl:place-self-center mx-6 py-1 px-1 my-2 w-72 border-2 border-gray-200 box-border" id="icon" type="file" @change="setImage($event)">
            </li>
            <img class="text-gray-400" :src="image" alt="アイコンのイメージ">
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
              <input class="xl:place-self-center border-gray-200 box-border" id="email_notification" type="checkbox" v-model="user.email_notification">
              <label class="xl:mr-36 xl:-ml-36 mt-1" for="email_notification">{{ user.email_notification === 'receivez' ? '受信する' : '受信しない' }}</label>
            </li>
            <div class="error text-sm text-red-400" v-for="(errMsg, index) in error" :key="index">{{ errMsg }}</div>
            <button class="update_button mx-5 mt-7">更新</button>
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
      user: {},
      image: null,
      error: null
    }
  },
  methods: {
    async getBasicSettingEdit() {
      try {
        this.error = null
        const res = await axios.get('http://localhost:3001/auth/users', {
          headers: {
          uid: window.localStorage.getItem('uid'),
          "access-token": window.localStorage.getItem('access-token'),
          client: window.localStorage.getItem('client'),
          'Accept': 'application/json'
          }
        })
        this.user = res.data.data
      } catch {
        this.$router.push({name: 'LoginPage'})
      }
    },
    setImage(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    redirectToSendEmail () {
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
