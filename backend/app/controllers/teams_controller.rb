class TeamsController < ApplicationController
  before_action :authenticate, except: [:index]
  
  def create
    @team = current_user.teams.new(create_params)
    return render json: { errors: @team.errors.full_messages }, status: 400 unless @team.save
  end

  def update
    @team = current_user.teams.find(params[:id])
    return render json: { errors: @team.errors.full_messages }, status: 400 unless @team.update(create_params)
  end

  def index
    @teams = current_user.teams
    render json: { message: '成功しました', data: @teams }, status: 200
  end

  def show
    @team = Team.find(params[:id])
  end

  def destroy
    @team = Team.find(params[:id])
    @team.destroy
  end

  private

  def create_params
    params
    .require(:team)
    .permit(:name, :area, :sex, :track_record, :other_body, :sports_type_id, :prefecture_id, sports_discipline_ids: [], target_age_ids: [])
  end
end
