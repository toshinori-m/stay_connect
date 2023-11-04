class Auth::UsersController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def update
    @current_user = User.find(params[:id])
    @current_user.update(user_params)
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
    .permit(:name, :email, :password, :image, :birthday, :sex, :self_introduction, :email_notification)
  end
end
