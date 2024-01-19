module ChatRooms
  class ChatMessagesController < ApplicationController
    before_action :authenticate, only: [:create, :index]
    before_action :set_chat_room, only: [:create, :index]

    def create
      @chat_message = ChatMessage.create_with_user_and_room(@chat_room, current_user, message_params)
    
      RoomChannel.broadcast_to(@chat_room, {
        message: @chat_message.message,
        name: current_user.name,
        created_at: @chat_message.created_at.strftime("%Y-%m-%d %H:%M:%S")
      })
      @chat_room.notify_other_users(@chat_message)
      head :ok
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
    
    def index
      @chat_messages = @chat_room.chat_messages.eager_load(:user).order(created_at: :desc)
    end

    private

    def set_chat_room
      @chat_room = ChatRoom.find(params[:chat_room_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Chat room not found' }, status: :not_found
    end

    def message_params
      params.require(:chat_message).permit(:message)
    end
  end
end
