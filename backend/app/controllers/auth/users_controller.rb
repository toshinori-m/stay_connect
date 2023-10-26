class Auth::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def update
    user = User.find(params[:id])
    return render json: { message: '成功しました', data: user }, status: 200 if user.update(user_params)

    render json: { message: '保存出来ませんでした', errors: user.errors }, status: 400
  end

  def index
    return render json: { is_login: true, data: current_user }, status: 200 if current_user

    render json: { is_login: false, message: "ユーザーが存在しません" }, status: 400
  end

  def show
    render json: { message: '成功しました', data: User.select(:name, :image, :birthday, :sex) }, status: 200
  end

  private

  def user_params
    params
    .permit(:name, :email, :password, :image, :birthday, :sex, :self_introduction)
  end
end
