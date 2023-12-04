class UsersController < ApplicationController
  include Session
  before_action :authenticate, except: [:create, :show, :index]
  
  def create
    existing_user = User.find_by(email: user_params[:email])
    return head :ok if existing_user
    
    @current_user = User.new(user_params)
    render json: { error: @current_user.errors.full_messages }, status: :unprocessable_entity and return unless @current_user.save
  end

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
    .require(:user)
    .permit(:name, :email, :uid, :image, :birthday, :sex, :self_introduction, :email_notification)
  end
end
