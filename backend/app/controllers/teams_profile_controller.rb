class TeamsProfileController < ApplicationController
  before_action :authenticate, only: [:index, :show]
  before_action :set_user, only: [:index, :show]

  def index
    @teams = @user.teams.includes(:sports_disciplines, :target_ages)
    render json: @teams
  end

  def show
    @team = @user.teams.find(params[:id])
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end
end
