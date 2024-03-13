<template>
  <div>
    <div class="z-40 fixed top-0 bg-sky-200 p-5 w-full h-41 md:pl-32 md:h-16 md:text-left md:pl-8">
      <div class="flex justify-center md:justify-start">
        <div class="float-left">
          <MouseCharacter />
        </div>
        <button class="font-bold text-3xl text-blue-600 md:-mt-4" @click="home">stay_connect</button>
      </div>
      <div class="mt-2 md:text-right md:-mt-12 md:mr-8">
        <div class="flex justify-center items-start md:flex md:items-start md:justify-end md:-mt-5 mr-0 md:mr-10 lg:mr-0">
          <button class="bg-sky-200 my-2 text-blue-600 px-3 mt-4" @click="chatRoomList">
            <span class="i-lucide-mail w-6 h-6 float-left"></span>
          </button>
          <button class="lg:hidden text-blue-600 px-3 mt-4" @click="toggle">
            <span class="i-lucide-align-justify w-6 h-6"></span>
          </button>
          <ul :class="{'hidden' :isClose}" v-click-outside="closeMenu" class="bg-sky-200 flex-col lg:flex lg:flex-row justify-end text-blue-600">
            <li class="p-4 text-sm hover:bg-sky-400 hover:text-white">
              <button @click="home">ホーム</button>
            </li>
            <li class="p-4 text-sm hover:bg-sky-400 hover:text-white">
              <button @click="eventSetting">イベント作成</button>
            </li>
            <li class="p-4 text-sm hover:bg-sky-400 hover:text-white">
              <button @click="eventSettingList">イベント一覧</button>
            </li>
            <li class="p-4 text-sm hover:bg-sky-400 hover:text-white">
              <button @click="editBasicSetting">基本設定</button>
            </li>
            <li class="p-4 text-sm hover:bg-sky-400 hover:text-white">
              <button @click="teamProfileList">チーム紹介一覧</button>
            </li>
            <li class="p-4 ml-2 text-sm lg:-mr-7 hover:bg-sky-400 hover:text-white">
              <button  @click="logOut">ログアウト</button>
            </li>
            <div class="error">{{ error }}</div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MouseCharacter from './MouseCharacter.vue'
import vClickOutside from 'click-outside-vue3'

export default {
  data () {
    return {
      isClose: true,
      error: null
    }
  },
  components: {
    MouseCharacter
  },
  methods: {
    async logOut() {
      try {
        this.error = null
        await this.$store.dispatch('logout')
        this.$router.push({ name: 'LoginPage' })
      } catch {
        this.error = "ログアウト出来ませんでした" 
        this.$router.push({ name: 'LoginPage' })
      }
    },
    toggle(event) {
      event.stopPropagation()
      this.isClose = !this.isClose
    },
    chatRoomList() {
      this.$router.push({name: 'ChatRoomListPage'})
    },
    home() {
      this.isClose = true
      this.$router.push({name: 'HomePage'})
    },
    eventSetting() {
      this.isClose = true
      this.$router.push({name: 'EventSettingPage'})
    },
    eventSettingList() {
      this.isClose = true
      this.$router.push({name: 'EventSettingListPage'})
    },
    editBasicSetting() {
      this.isClose = true
      this.$router.push({name: 'BasicSettingEditPage'});
    },
    teamProfileList() {
      this.isClose = true
      this.$router.push({name: 'TeamProfileListPage'});
    },
    closeMenu() {
      this.isClose = true
    }
  },
  directives: {
    clickOutside: vClickOutside.directive
  }
}
</script>
