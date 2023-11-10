class ChatRoomsController < ApplicationController
  before_action :authenticate_user!
  
  def create
    @chat_room = current_user.chat_rooms.new(create_params)
    if @chat_room.save
      chat_room_user = ChatRoomUser.new(user: current_user, chat_room: @chat_room)
      chat_room_user.save
    else
      render json: { errors: @chat_room.errors.full_messages }, status: 400
    end
  end

  def update
    @chat_room = current_user.chat_rooms.find(params[:id])

    return render json: { errors: @chat_room.errors.full_messages }, status: 400 unless @chat_room.update(create_params)
  end

  def index
    @chat_rooms = current_user.chat_rooms
  end

  def destroy
    @chat_room = current_user.chat_rooms.find(params[:id])
    @chat_room.destroy
  end

  private

  def create_params
    params
    .require(:chat_room)
    .permit(:paid_or_free )
  end
end
