class ChatRoomsController < ApplicationController
  before_action :authenticate

  def create
    other_user_id = params[:other_user_id]
    @chat_room = ChatRoom.find_or_create_by_users!(current_user.id, other_user_id)
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def update
    @chat_room = current_user.chat_rooms.find(params[:id])

    render json: { errors: @chat_room.errors.full_messages }, status: 400 unless @chat_room.update(create_params)
  end

  PER_PAGE = 10
  def index
    @paginated_chat_rooms = current_user
      .chat_rooms_with_other_users
      .page(params[:page])
      .per(PER_PAGE)

    @total_pages = @paginated_chat_rooms.total_pages
  end

  def show
    @chat_room = ChatRoom.find(params[:id])
    @other_user = @chat_room.other_user(user_id: current_user.id)
  end

  def destroy
    chat_room = current_user.chat_rooms.find(params[:id])
    chat_room.destroy!
    @chat_rooms = current_user.chat_rooms
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: '対象のチャットルームが見つかりません。' }, status: :not_found
  rescue ActiveRecord::RecordNotDestroyed => e
    render json: { error: '削除に失敗しました。', errors: e.record.errors.messages }, status: :internal_server_error
  end

  private

  def create_params
    params
    .require(:chat_room)
    .permit(:paid_or_free, :other_user_id )
  end
end
