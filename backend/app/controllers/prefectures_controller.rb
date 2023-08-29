class PrefecturesController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]

  def create
    prefectures = Prefecture.new(create_params)
    return render json: { message: '成功しました', data: prefectures }, status: 200 if prefectures.save

    render json: { message: '保存出来ませんでした', errors: prefectures.errors.messages }, status: 400
  end

  def update
    return render json: { message: '成功しました', data: find_prefecture }, status: 200 if find_prefecture.update(create_params)

    render json: { message: '保存出来ませんでした', errors: @prefectures.errors }, status: 400
  end

  def index
    prefectures = Prefecture.all
    render json: { message: '成功しました', data: prefectures }, status: 200
  end

  def show
    render json: { message: '成功しました', data: find_prefecture }, status: 200
  end

  def destroy
    return render json: { message: '削除に成功しました', data: @prefectures }, status: 200 if find_prefecture.destroy
    
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

  def find_prefecture
    @prefectures = Prefecture.find(params[:id])
  end
end
