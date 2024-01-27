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
        <div class="flex justify-center flex-wrap md:justify-end items-center md:-mt-5">
          <button class="bg-sky-200 my-2 text-blue-600 px-3 py-2" @click="chatRoomList">
            <span class="i-lucide-mail w-6 h-6 float-left"></span>
          </button>
          <div class="text-right bg-sky-200">
            <button class="xl:hidden i-lucide-align-justify w-6 h-6 float-left text-blue-600" @click="toggle($event)"></button>
          </div>
          <ul :class="{'hidden' :isClose}" v-click-outside="closeMenu" class="bg-sky-200 flex-col xl:flex xl:flex-row justify-end text-blue-600">
            <li class="p-4 mx-2 hover:bg-sky-400 hover:text-white">
              <button @click="home">ホーム</button>
            </li>
            <li class="p-4 mx-2 hover:bg-sky-400 hover:text-white">
              <button @click="eventSetting">イベント作成</button>
            </li>
            <li class="p-4 mx-2 hover:bg-sky-400 hover:text-white">
              <button @click="eventSettingList">イベント一覧</button>
            </li>
            <li class="p-4 mx-2 hover:bg-sky-400 hover:text-white">
              <button @click="editBasicSetting">基本設定</button>
            </li>
            <li class="p-4 mx-2 hover:bg-sky-400 hover:text-white">
              <button @click="teamProfileList">チーム紹介一覧</button>
            </li>
            <li class="p-4 ml-2 -mr-7 hover:bg-sky-400 hover:text-white">
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
        this.error = error
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
      this.$router.push({name: 'HomePage'})
    },
    eventSetting() {
      this.$router.push({name: 'EventSettingPage'})
    },
    eventSettingList() {
      this.$router.push({name: 'EventSettingListPage'})
    },
    editBasicSetting() {
      this.$router.push({name: 'BasicSettingEditPage'});
    },
    teamProfileList() {
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
