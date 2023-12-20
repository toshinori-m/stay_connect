class ChatRoomUsersController < ApplicationController
  before_action :authenticate, only: [:create, :index]

  def create
    chat_room = ChatRoom.find(params[:chat_room_id])
    
    render json: { error: 'ユーザーIDが見つからないか、無効です。' }, status: 400 and return if params[:user_id].nil?
  
    @chat_room_user = chat_room.chat_room_users.new(user_id: params[:user_id])

    head :ok and return if @chat_room_user.save

    render json: { errors: @chat_room_user.errors.full_messages }, status: 400
  end

  def index
    @chat_room_users = current_user.chat_room_users
  end
end
