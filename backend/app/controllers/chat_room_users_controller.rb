class ChatRoomUsersController < ApplicationController
  before_action :authenticate_user!, only: [:index]

  def index
    @chat_room_users = current_user.chat_room_users
  end
end
