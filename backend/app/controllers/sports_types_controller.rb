class SportsTypesController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]

  def create
    render json: { message: '成功しました', data: sports_type }, status: 200 if sports_type.save

    render json: { message: '保存出来ませんでした', errors: sports_type.errors.messages }, status: 400
  end

  def show
    render json: { message: '成功しました', data: find_sports_type }, status: 200
  end

  def destroy
    return render json: { message: '削除に成功しました' }, status: 200 if find_sports_type.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def authenticate_user
    unless logged_in?
      flash[:error] = "このセクションにアクセスするにはログインが必要です"
      redirect_to new_login_url # リクエストサイクルを停止する
    end
  end
  
  def sports_type
    Sports_type.new(create_params)
  end

  def create_params
    params.permit(:name)
  end

  def find_sports_type
    Sports_type.find(params[:id])
  end
end
