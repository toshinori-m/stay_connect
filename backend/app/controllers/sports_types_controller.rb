class SportsTypesController < ApplicationController
  before_action :authenticate, except: [:index]
  
  def create
    sports_types = SportsType.new(create_params)
    return render json: { message: '成功しました' }, status: 200 if sports_types.save

    render json: { message: '保存出来ませんでした', errors: sports_types.errors.messages }, status: 400
  end

  def update
    sports_type = SportsType.find(params[:id])
    return render json: { message: '成功しました' }, status: 200 if sports_type.update(create_params)

    render json: { message: '保存出来ませんでした', errors: sports_type.errors }, status: 400
  end

  def index
    sports_types = SportsType.all
    render json: { message: '成功しました', data: sports_types }, status: 200
  end

  def show
    @sports_type = SportsType.find(params[:id])
  end

  def destroy
    sports_type = SportsType.find(params[:id])
    return render json: { message: '削除に成功しました' }, status: 200 if sports_type.destroy
    
    render json: { message: '削除に失敗しました' }, status: 400
  end

  private
  
  def create_params
    params.permit(:name)
  end
end
