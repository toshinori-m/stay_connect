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

  def update
    @chat_room = current_user.chat_rooms.find(params[:id])

    render json: { errors: @chat_room.errors.full_messages }, status: 400 unless @chat_room.update(create_params)
  end

  def index
    @chat_rooms_with_other_user = current_user.chat_rooms.eager_load(chat_room_users: :user).map do |room|
      other_user = room.other_user(user_id: current_user.id)
      {
        chat_room: room,
        other_user_name: other_user&.name
      }
    end
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
