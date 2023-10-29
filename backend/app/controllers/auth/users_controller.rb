class Auth::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def update
    user = User.find(params[:id])
    return render json: { data: user }, status: 200 if user.update(user_params)

    render json: {}, status: 400
  end

  def index
    return render json: { is_login: true, data: current_user }, status: 200 if current_user

    render json: { is_login: false }, status: 400
  end

  def show
    render json: { data: User.select(:name, :image, :birthday, :sex) }, status: 200
  end

  private

  def user_params
    params
    .permit(:name, :email, :password, :image, :birthday, :sex, :self_introduction)
  end
end
