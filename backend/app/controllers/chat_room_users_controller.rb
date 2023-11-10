class ChatRoomUsersController < ApplicationController
  before_action :authenticate_user!, only: [:index]

  def index
    @chat_room_users = ChatRoomUser.eager_load(:chat_room, :user).where(user_id: current_user.id)
  end
end
