class ChatMessagesController < ApplicationController
  before_action :authenticate_user!, only: [:create, :index]
  
  def create
    chat_room = ChatRoom.find(create_params[:chat_room_id])
    @chat_message = current_user.chat_messages.new(create_params)

    return render json: { errors: @chat_message.errors.full_messages }, status: 400 unless @chat_message.save
  end

  def index
    chat_room = ChatRoom.find(create_params[:chat_room_id])
    @chat_messages = chat_room.chat_messages.eager_load(:user).order(created_at: :desc)

    return render json: { errors: @chat_message.errors.full_messages }, status: 400 unless chat_room
  end

  private

  def create_params
    params
    .require(:chat_message)
    .permit(:message, :chat_room_id)
  end
end
