class TargetAgesController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def create
    target_ages = TargetAge.new(create_params)
    return render json: { message: '成功しました', data: target_ages }, status: 200 if target_ages.save

    render json: { message: '保存出来ませんでした', errors: target_ages.errors.messages }, status: 400
  end

  def update
    target_age = TargetAge.find(params[:id])
    return render json: { message: '成功しました', data: target_age }, status: 200 if target_age.update(create_params)

    render json: { message: '保存出来ませんでした', errors: target_age.errors }, status: 400
  end

  def index
    target_ages = TargetAge.all
    render json: { message: '成功しました', data: target_ages }, status: 200
  end

  def show
    render json: { message: '成功しました', data: TargetAge.find(params[:id]) }, status: 200
  end

  def destroy
    target_age = TargetAge.find(params[:id])
    return render json: { message: '削除に成功しました', data: target_age }, status: 200 if target_age.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def create_params
    params.permit(:name)
  end
end
