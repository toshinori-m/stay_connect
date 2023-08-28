class TeamsController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]

  def create
    return render json: { message: '成功しました', data: new_team }, status: 200 if new_team.save

    render json: { message: '保存出来ませんでした', errors: new_team.errors.messages }, status: 400
  end

  def show
    render json: { message: '成功しました', data: find_team }, status: 200
  end

  def destroy
    return render json: { message: '削除に成功しました' }, status: 200 if find_team.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def new_team
    Team.new(create_params)
  end

  def create_params
    params.permit(:name, :area, :sex, :track_record, :other_body).merge(user_id: current_user.id)
  end

  def find_team
    User.find(params[:id])
  end
end
