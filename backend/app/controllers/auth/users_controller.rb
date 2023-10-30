class Auth::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def update
    user = User.find(params[:id])
    return render json: { data: user }, status: 200 if user.update(user_params)

    render json: {}, status: 400
  end

  def index
    @current_user = current_user
  end

  def show
    @current_user = current_user
  end

  private

  def user_params
    params
    .permit(:name, :email, :password, :image, :birthday, :sex, :self_introduction)
  end
end
