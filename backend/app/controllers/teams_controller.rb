class TeamsController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def create
    @team = Team.new(create_params)
    return render json: {}, status: 200 if @team.save

    render json: { errors: @team.errors }, status: 400
  end

  def update
    @team = Team.find(params[:id])
    return render json: {}, status: 200 if @team.update(create_params)

    render json: { errors: @team.errors }, status: 400
  end

  def index
    @team = Team.all
  end

  def show
    @team = Team.find(params[:id])
  end

  def destroy
    @team = Team.find(params[:id])
    return render json: {}, status: 200 if @team.destroy
    
    render json: {}, status: 400
  end

  private

  def create_params
    params
    .require(:team)
    .permit(:name, :area, :sex, :track_record, :other_body, :sports_type_id, :prefecture_id, sports_discipline_ids: [], target_age_ids: [])
    .merge(user_id: current_user.id)
  end
end
