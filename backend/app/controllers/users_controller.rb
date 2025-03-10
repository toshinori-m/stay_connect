class UsersController < ApplicationController
  before_action :authenticate, except: [:create]
  
  def create
    @user = User.new(user_params)
    @user.save!
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.messages }, status: :unprocessable_entity 
  end

  def update
    @user = User.find(params[:id])
    render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity and return unless @user.update(user_params)
  end

  def show
    @user = current_user
  end

  def me
    if current_user
      render json: current_user.as_json(only: [:id, :name, :email, :uid])
    else
      head :not_found
    end
  end

  private

  def user_params
    params
    .require(:user)
    .permit(:name, :email, :uid, :image, :birthday, :sex, :self_introduction, :email_notification)
  end
end
