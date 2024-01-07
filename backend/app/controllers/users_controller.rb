class UsersController < ApplicationController
  before_action :authenticate, except: [:create]
  
  def create
    existing_user = User.find_by(email: user_params[:email])
    return head :ok if existing_user
    
    @user = User.new(user_params)
    render json: { error: @user.errors.full_messages }, status: :unprocessable_entity and return unless @user.save
  end

  def update
    @user = User.find(params[:id])
    render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity and return unless @user.update(user_params)
  end

  def show
    @user = current_user
  end

  private

  def user_params
    params
    .require(:user)
    .permit(:name, :email, :uid, :image, :birthday, :sex, :self_introduction, :email_notification)
  end
end
