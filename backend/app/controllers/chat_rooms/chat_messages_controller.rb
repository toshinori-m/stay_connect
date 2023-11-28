module ChatRooms
  class ChatMessagesController < ApplicationController
    before_action :authenticate_user!, only: [:create, :index]
    before_action :set_chat_room, only: [:create, :index]

    def create
      message = @chat_room.chat_messages.new(message_params.merge(user: current_user))
    
      if message.save
        RoomChannel.broadcast_to(@chat_room, {
          message: message.message,
          name: current_user.name,
          created_at: message.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
        (@chat_room.users.where.not(id: current_user.id).distinct).each do |user|
          UserMailer.with(user_name: message.user.name, user_message: message.message, recipient_email: user.email, recipient_name: user.name ).new_message_notification.deliver_later
        end
        head :ok
      else
        render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
      end
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
