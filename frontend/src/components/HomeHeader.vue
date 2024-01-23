<template>
  <div>
    <div class="text-center z-40 fixed top-0 bg-sky-200 p-5 w-full h-41 md:pl-32 md:h-16 md:text-left md:pl-8">
      <div class="flex justify-center md:justify-start items-center w-full">
        <div class="animate-bounce">
          <svg class="float-left h-12 w-12 md:-mt-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" >
            <!-- ネズミの本体 -->
            <circle cx="50" cy="50" r="40" fill="#38BDF8" />

            <!-- ネズミの耳 -->
            <circle cx="22" cy="30" r="12" fill="#38BDF8" />
            <circle cx="22" cy="30" r="6" fill="#FFF" />
            <circle cx="78" cy="30" r="12" fill="#38BDF8" />
            <circle cx="78" cy="30" r="6" fill="#FFF" />

            <!-- ネズミの目 -->
            <circle cx="35" cy="50" r="5" fill="#000" />
            <circle cx="65" cy="50" r="5" fill="#000" />

            <!-- ネズミの鼻 -->
            <circle cx="50" cy="60" r="3" fill="#F00" />

            <!-- ネズミのほっぺ -->
            <circle cx="32" cy="65" r="4" fill="#FAB" />
            <circle cx="68" cy="65" r="4" fill="#FAB" />

            <!-- ネズミのしっぽ -->
            <path d="M 75,75 q 15,-10 25,5" stroke="#38BDF8" stroke-width="2" fill="none" />
          </svg>
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
import vClickOutside from 'click-outside-vue3'

export default {
  data () {
    return {
      isClose: true,
      error: null
    }
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
