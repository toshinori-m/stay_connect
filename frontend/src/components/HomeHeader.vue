<template>
  <div>
    <div class="text-center z-40 fixed top-0 bg-sky-200 p-5 w-full h-41 md:pl-32 md:h-16  md:text-left">
      <button class="font-bold text-3xl text-blue-600 md:-mt-1" @click="home">stay_connect</button>
      <div class="mt-2 md:text-right md:-mt-11">
        <div class="flex justify-center flex-wrap md:justify-end items-center md:-mt-5">
        <form @submit.prevent="redirectToRegister">
          <button class="my-2 text-blue-600 px-3 py-2">
            <span className="i-lucide-mail w-6 h-6 float-left"></span>
          </button>
        </form>
          <div class="text-right">
            <button className="md:hidden i-lucide-align-justify w-6 h-6 float-left text-blue-600" @click="toggle"></button>
          </div>
          <ul v-bind:class="{ 'hidden' : isClose }" class="flex-col md:flex md:flex-row justify-end text-blue-600 ">
            <li class="p-5 md:p-0 mx-5 hover:bg-sky-400 hover:text-white">
              <button @click="home">ホーム</button>
            </li>
            <li class="p-5 md:p-0 mx-5 hover:bg-sky-400 hover:text-white">
              <button @click="event_setting">イベント作成</button>
            </li>
            <li class="p-5 md:p-0 mx-5">基本設定</li>
            <li class="p-5 md:p-0 mx-5">ログアウト</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isClose: true
    }
  },
  methods: {
    toggle () {
      this.isClose = !this.isClose;
    },
    home () {
      this.$router.push({name: 'HomePage'})
    },
    event_setting () {
      this.$router.push({name: 'EventSettingPage'})
    }
  }
}
</script>
