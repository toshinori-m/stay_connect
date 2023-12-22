<template>
  <div class="flex flex-col items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1">チャットルーム</h2>
      <button class="cancel_button mx-5 float-right" @click="chatRoomCancel">戻る</button>
      <div class="my-14">
        <form class="flex flex-col items-center justify-center">
          <textarea
            class="text-left mt-3 mb-8 sm:mx-6 w-full h-28 pt-3 ring-offset-2 ring-2 rounded-lg"
            placeholder="メッセージを入力してEnterを押すと送信出来ます。"
            v-model="message"
            @keypress.enter.prevent="chatMessage"
          ></textarea>
        </form>
        <div class="error text-sm text-red-400" v-for="(errMsg, index) in errors" :key="index">{{ errMsg }}</div>
        <div class="flex flex-col items-center justify-center">
          <ul class="text-left my-2 sm:mx-6 w-full px-2 ring-offset-2 ring-2 rounded-lg" type="text" v-for="message in messages" :key="message.id">
            <li class="name text-sm">{{ message.name }}</li>
            <li class="created-at text-xs text-gray-400">{{ message.created_at }}</li>
            <li class="message pt-3">{{ message.message }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/lib/apiClient'
import { createConsumer } from "@rails/actioncable"

export default {
  data() {
    return {
      messages: [],
      message: '',
      errors: []
    }
  },
  methods: {
    async getChatMessage() {
      try {
        this.errors = []
        const res = await apiClient.get(`/chat_rooms/${this.$route.params.id}/chat_messages`)
        this.messages = res.data
      } catch {
        this.errors = 'チャットルームを表示できませんでした。'
      }
    },
    async chatMessage() {
      try {
        this.errors = []
        await apiClient.post(`/chat_rooms/${this.$route.params.id}/chat_messages`, {
          chat_message: { 
            message: this.message
          },
        })
        this.message = ''
      } catch (errors) {
        if (errors.response.data.errors) {
          this.errors = errors.response.data.errors;
        }
      }
    },
    chatRoomCancel() {
      this.$router.push({name: 'ChatRoomListPage'})
    }
  },
  mounted() {
    const consumer = createConsumer(`ws://localhost:3001/cable?uid=${this.$store.getters['uid']}`)
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
