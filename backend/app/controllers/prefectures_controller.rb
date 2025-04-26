class PrefecturesController < ApplicationController
  before_action :authenticate, except: [:index]

  def create
    prefectures = Prefecture.new(create_params)
    return render json: { message: '成功しました' }, status: 200 if prefectures.save

    render json: { message: '保存出来ませんでした', errors: prefectures.errors.messages }, status: 400
  end

  def update
    prefecture = Prefecture.find(params[:id])
    return render json: { message: '成功しました' }, status: 200 if prefecture.update(create_params)

    render json: { message: '保存出来ませんでした', errors: prefecture.errors }, status: 400
  end

  def index
    prefectures = Prefecture.all
    render json: { message: '成功しました', data: prefectures }, status: 200
  end

  def show
    @prefecture = Prefecture.find(params[:id])
  end

  def destroy
    prefecture = Prefecture.find(params[:id])
    return render json: { message: '削除に成功しました' }, status: 200 if prefecture.destroy
    
    render json: { message: '削除に失敗しました' }, status: 400
  end

  private

  def create_params
    params.permit(:name)
  end
end
