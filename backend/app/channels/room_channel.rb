class RoomChannel < ApplicationCable::Channel
  def subscribed
    chat_room = ChatRoom.find(params[:room_id])
    stream_for chat_room
  end
end
