class ChatRoomsController < ApplicationController
  before_action :authenticate_user!, except: [:show]
  
  def create
    ChatRoom.transaction do
      @chat_room = current_user.chat_rooms.new(create_params)
      @chat_room.save!
      chat_room_user = ChatRoomUser.new(user: current_user, chat_room: @chat_room)
      chat_room_user.save!
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: 400
  end

  def add_user
    @chat_room = ChatRoom.find(params[:id])
    
    render json: { error: 'ユーザーIDが見つからないか、無効です。' }, status: 400 and return if params[:user_id].nil?
  
    chat_room_user = @chat_room.chat_room_users.new(user_id: params[:user_id])

    head :ok and return if chat_room_user.save

    render json: { errors: chat_room_user.errors.full_messages }, status: 400
  end

  def update
    @chat_room = current_user.chat_rooms.find(params[:id])

    render json: { errors: @chat_room.errors.full_messages }, status: 400 unless @chat_room.update(create_params)
  end

  def index
    @chat_rooms_with_other_user = current_user.chat_rooms_with_other_users
  end

  def destroy
    chat_room = current_user.chat_rooms.find(params[:id])
    chat_room.destroy
    render json: {}, status: 200
  end

  private

  def create_params
    params
    .require(:chat_room)
    .permit(:paid_or_free )
  end
end
