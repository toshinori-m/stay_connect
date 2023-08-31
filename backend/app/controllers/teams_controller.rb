class TeamsController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def create
    teams = Team.new(create_params)
    return render json: { message: '成功しました', data: teams }, status: 200 if teams.save

    render json: { message: '保存出来ませんでした', errors: teams.errors.messages }, status: 400
  end

  def update
    team = Team.find(params[:id])
    return render json: { message: '成功しました', data: team }, status: 200 if team.update(create_params)

    render json: { message: '保存出来ませんでした', errors: team.errors }, status: 400
  end

  def index
    teams = Team.all
    render json: { message: '成功しました', data: teams }, status: 200
  end

  def show
    render json: { message: '成功しました', data: Team.find(params[:id]) }, status: 200
  end

  def destroy
    team = Team.find(params[:id])
    return render json: { message: '削除に成功しました', data: team }, status: 200 if team.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def create_params
    params
    .permit(:name, :area, :sex, :track_record, :other_body, :sports_type_id, :prefecture_id )
    .merge(user_id: current_user.id )
  end
end
