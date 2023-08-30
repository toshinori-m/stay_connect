class TeamsController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]

  def create
    teams = Team.new(create_params)
    return render json: { message: '成功しました', data: teams }, status: 200 if teams.save

    render json: { message: '保存出来ませんでした', errors: teams.errors.messages }, status: 400
  end

  def update
    return render json: { message: '成功しました', data: find_team }, status: 200 if find_team.update(create_params)

    render json: { message: '保存出来ませんでした', errors: @teams.errors }, status: 400
  end

  def index
    teams = Team.all
    render json: { message: '成功しました', data: teams }, status: 200
  end

  def show
    render json: { message: '成功しました', data: find_team }, status: 200
  end

  def destroy
    return render json: { message: '削除に成功しました', data: @teams  }, status: 200 if find_team.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def new_team
    Team.new(create_params)
  end

  def create_params
    params
    .permit(:name, :area, :sex, :track_record, :other_body, :sports_type_id, :prefecture_id )
    .merge(user_id: current_user.id )
  end

  def find_team
    @teams = Team.find(params[:id])
  end
end
