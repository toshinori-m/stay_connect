class ChatRoomsController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def create
    chat_rooms = ChatRoom.new(create_params)
    return render json: { message: '成功しました', data: chat_rooms }, status: 200 if chat_rooms.save

    render json: { message: '保存出来ませんでした', errors: chat_rooms.errors.messages }, status: 400
  end

  def update
    chat_room = ChatRoom.find(params[:id])
    return render json: { message: '成功しました', data: chat_room }, status: 200 if chat_room.update(create_params)

    render json: { message: '保存出来ませんでした', errors: chat_room.errors }, status: 400
  end

  def index
    chat_rooms = ChatRoom.all
    render json: { message: '成功しました', data: chat_rooms }, status: 200
  end

  def show
    render json: { message: '成功しました', data: ChatRoom.find(params[:id]) }, status: 200
  end

  def destroy
    chat_room = ChatRoom.find(params[:id])
    return render json: { message: '削除に成功しました', data: chat_room }, status: 200 if chat_room.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def create_params
    params.permit(:paid_or_free )
  end
end
