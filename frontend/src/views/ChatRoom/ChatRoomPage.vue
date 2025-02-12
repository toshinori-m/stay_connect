<template>
  <div class="flex flex-col items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-16 font-bold text-3xl text-blue-600 mt-16 md:mt-1">チャットルーム</h2>
      <h3 class="text-center text-xl text-blue-600 md:mt-1 break-words">{{ otherUserName }}
        <span class="text-base text-black">さんとチャット</span>
      </h3>
      <button class="cancel_button mx-5 float-right" @click="chatRoomCancel">戻る</button>
      <div class="my-14">
        <form class="flex flex-col items-center justify-center">
          <textarea
            class="text-left mt-3 mb-8 sm:mx-6 w-full h-28 pt-3 ring-offset-2 ring-2 rounded-lg"
            placeholder="メッセージを入力してEnterを押すと送信出来ます。"
            v-model="message"
            @keypress.enter.prevent="chatMessage"
          ></textarea>
          <div v-if="remainingChatMessage <= 5" class="text-red-500">
            地域はあと{{ remainingChatMessage }}文字までです。
          </div>
        </form>
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
        <div class="flex flex-col items-center justify-center">
          <ul class="text-left my-2 sm:mx-6 w-full px-2 ring-offset-2 ring-2 rounded-lg" type="text" v-for="message in messages" :key="message.id">
            <li class="text-sm break-words">{{ message.name }}</li>
            <li class="text-xs text-gray-400">{{ message.created_at }}</li>
            <li class="text-xs text-gray-400" v-if="message.read">既読</li>
            <li class="pt-3">{{ message.message }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getApiClient from '@/lib/apiClient'
import { createConsumer } from "@rails/actioncable"

export default {
  data() {
    return {
      messages: [],
      message: '',
      otherUserName: '',
      errors: []
    }
  },
  computed: {
    remainingChatMessage() {
      const maxChars = 255;
      return maxChars - this.message.length;
    }
  },
  methods: {
    async fetchChatRoomData() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get(`/chat_rooms/${this.$route.params.id}`)
        this.chatRoom = res.data.chat_room
        this.otherUserName = res.data.other_user.name
      } catch {
        this.errors.push('チャットルームデータを取得できませんでした。')
      }
    },
    async getChatMessage() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        const res = await apiClient.get(`/chat_rooms/${this.$route.params.id}/chat_messages`)
        this.messages = res.data
      } catch {
        this.errors.push('チャットルームを表示できませんでした。')
      }
    },
    async chatMessage() {
      try {
        this.errors = []
        const apiClient = getApiClient()
        await apiClient.post(`/chat_rooms/${this.$route.params.id}/chat_messages`, {
          chat_message: { 
            message: this.message
          }
        })
        this.message = ''
      } catch (errors) {
        if (errors.response.data.errors) {
          this.errors.push(errors.response.data.errors)
        }
      }
    },
    chatRoomCancel() {
      this.$router.push({name: 'ChatRoomListPage'})
    }
  },
  mounted() {
    this.fetchChatRoomData()
    const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3001'
    const wsProtocol = apiBaseUrl.startsWith('https') ? 'wss' : 'ws'
    const consumer = createConsumer(`${wsProtocol}://${new URL(apiBaseUrl).host}/cable?uid=${this.$store.getters['uid']}`)
    this.messageChannel = consumer.subscriptions.create({ channel: "RoomChannel", room_id: this.$route.params.id }, {
      connected: () => {
        this.getChatMessage()
      },
      received: () => {
        this.getChatMessage()
      }
    })
  },
  beforeUnmount () { 
    this.messageChannel.unsubscribe()
  }
}
</script>
