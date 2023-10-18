class SportsDisciplinesController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  
  def create
    sports_disciplines = SportsDiscipline.new(create_params)
    return render json: { message: '成功しました' }, status: 200 if sports_disciplines.save

    render json: { message: '保存出来ませんでした', errors: sports_disciplines.errors.messages }, status: 400
  end

  def update
    sports_discipline = SportsDiscipline.find(params[:id])
    return render json: { message: '成功しました' }, status: 200 if sports_discipline.update(create_params)

    render json: { message: '保存出来ませんでした', errors: sports_discipline.errors }, status: 400
  end

  def index
    sports_disciplines = SportsDiscipline.where(sports_type_id: params[:sports_type_id])
    render json: { message: '成功しました', data: sports_disciplines }, status: 200
  end

  def destroy
    sports_discipline = SportsDiscipline.find(params[:id])
    return render json: { message: '削除に成功しました' }, status: 200 if sports_discipline.destroy
    
    render json: { message: '削除に失敗しました' }, status: 400
  end

  private

  def create_params
    params.permit(:name, :sports_type_id)
  end
end
