class RoomChannel < ApplicationCable::Channel
  def subscribed
    chat_room = ChatRoom.find(params[:room_id])
    stream_for chat_room
  end

  def receive(data)
    chat_room = ChatRoom.find(data['room_id'])
    if message = ChatMessage.create(message: data['message'], user: current_user, chat_room: chat_room)
      RoomChannel.broadcast_to(chat_room, {
        message: message.message,
        name: current_user.name,
        created_at: message.created_at.strftime("%Y-%m-%d %H:%M:%S")
      })
    end
  end
end
