class SportsTypesController < ApplicationController

  def create
    sports_types = SportsType.new(create_params)
    return render json: { message: '成功しました', data: sports_types }, status: 200 if sports_types.save

    render json: { message: '保存出来ませんでした', errors: sports_types.errors.messages }, status: 400
  end

  def update
    sports = SportsType.find(params[:id])
    return render json: { message: '成功しました', data: sports }, status: 200 if sports.update(create_params)

    render json: { message: '保存出来ませんでした', errors: sports.errors }, status: 400
  end

  def index
    sports_types = SportsType.all
    render json: { message: '成功しました', data: sports_types }, status: 200
  end

  def show
    render json: { message: '成功しました', data: SportsType.find(params[:id]) }, status: 200
  end

  def destroy
    sports = SportsType.find(params[:id])
    return render json: { message: '削除に成功しました', data: sports }, status: 200 if sports.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private
  
  def create_params
    params.permit(:name)
  end
end
