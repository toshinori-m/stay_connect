class SportsTypesController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]

  def create
    sports_types = SportsType.new(create_params)
    return render json: { message: '成功しました', data: sports_types }, status: 200 if sports_types.save

    render json: { message: '保存出来ませんでした', errors: sports_types.errors.messages }, status: 400
  end

  def update
    return render json: { message: '成功しました', data: find_sports_type }, status: 200 if find_sports_type.update(create_params)

    render json: { message: '保存出来ませんでした', errors: @sports.errors }, status: 400
  end

  def index
    sports_types = SportsType.all
    render json: { message: '成功しました', data: sports_types }, status: 200
  end

  def show
    render json: { message: '成功しました', data: find_sports_type }, status: 200
  end

  def destroy
    return render json: { message: '削除に成功しました', data: @sports }, status: 200 if find_sports_type.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def authenticate_user
    unless logged_in?
      flash[:error] = "このセクションにアクセスするにはログインが必要です"
      redirect_to new_login_url # リクエストサイクルを停止する
    end
  end

  def create_params
    params.permit(:name)
  end

  def find_sports_type
    @sports = SportsType.find(params[:id])
  end
end
