class ChatMessagesController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def create
    chat_messages = ChatMessage.new(create_params)
    return render json: { message: '成功しました', data: chat_messages }, status: 200 if chat_messages.save

    render json: { message: '保存出来ませんでした', errors: chat_messages.errors.messages }, status: 400
  end

  def update
    chat_message = ChatMessage.find(params[:id])
    return render json: { message: '成功しました', data: chat_message }, status: 200 if chat_message.update(create_params)

    render json: { message: '保存出来ませんでした', errors: chat_message.errors }, status: 400
  end

  def index
    chat_messages = ChatMessage.all
    render json: { message: '成功しました', data: chat_messages }, status: 200
  end

  def show
    render json: { message: '成功しました', data: ChatMessage.find(params[:id]) }, status: 200
  end

  def destroy
    chat_message = ChatMessage.find(params[:id])
    return render json: { message: '削除に成功しました', data: chat_message }, status: 200 if chat_message.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def create_params
    params.permit(:message, :chat_room_id).merge(user_id: current_user.id )
  end
end
