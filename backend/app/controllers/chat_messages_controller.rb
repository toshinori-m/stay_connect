class ChatMessagesController < ApplicationController
  before_action :authenticate_user!, only: [:create, :index]
  
  def create
    chat_room = ChatRoom.find_by(id: create_params[:chat_room_id])
    @chat_message = chat_room.chat_messages.new(create_params.merge(user: current_user))
    return render json: { errors: @chat_message.errors.full_messages }, status: 400 unless @chat_message.save
  end

  def index
    chat_room = ChatRoom.find_by(id: params[:chat_room_id])
    return render json: { errors: @chat_message.errors.full_messages }, status: 400 unless chat_room

    @chat_messages = chat_room.chat_messages.order(created_at: :desc)
  end

  private

  def create_params
    params
    .require(:chat_message)
    .permit(:message, :chat_room_id)
  end
end
