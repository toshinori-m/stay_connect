<template>
  <div class="flex flex-col items-center justify-center mt-12">
    <div class="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
      <h2 class="text-center pt-10 font-bold text-3xl text-blue-600 mt-16 md:mt-1">チャットルーム一覧</h2>
      <button class="cancel_button mx-5 float-right" @click="chatRoomListCancel">戻る</button>
      <div class="my-14">
        <div class="error text-sm text-red-400">{{ error }}</div>
        <div class="flex flex-col items-center justify-center">
          <div class="text-left my-3 sm:ml-4 sm:mr-6 w-72 pt-3 ring-offset-2 ring-2 rounded-lg break-words" type="text" v-for="chat_room in chat_rooms" :key="chat_room.id">チャット名:
            {{ chat_room.other_user_name }}
            <div class="flex justify-center">
              <button class="update_button" @click="editChatRoom(chat_room.id)">連絡</button>
            </div>
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
      chat_rooms: [],
      error: null
    }
  },
  methods: {
    async getChatRoomList() {
      try {
        const apiClient = getApiClient()
        this.error = null
        const res = await apiClient.get('/chat_rooms')
        this.chat_rooms = res.data
      } catch (error) {
        this.error = error.response ? error.response.data :'チャットルームを表示できませんでした。'
      }
    },
    editChatRoom(chatRoomId) {
      this.$router.push({name: 'ChatRoomPage', params: {id: chatRoomId} });
    },
    chatRoomListCancel() {
      this.$router.push({name: 'HomePage'})
    }
  },
  mounted() {
    this.getChatRoomList()
  }
}
</script>
