class RecruitmentsController < ApplicationController
  before_action :authenticate, except: [:show]
  
  def create
    recruitment = Recruitment.new(create_params)
    recruitment.sports_discipline_ids = params[:sports_discipline_ids]
    recruitment.target_age_ids = params[:target_age_ids]
    if recruitment.save
      render json: { message: '成功しました' }, status: 200
    else
      render json: { message: '保存出来ませんでした', errors: recruitment.errors.messages }, status: 400
    end
  end

  def update
    recruitment = Recruitment.find(params[:id])
    return render json: { message: '成功しました' }, status: 200 if recruitment.update(create_params)

    render json: { message: '保存出来ませんでした', errors: recruitment.errors.messages }, status: 400
  end

  def index
    recruitments = current_user.recruitments
    render json: { message: '成功しました', data: recruitments }, status: 200
  end

  def show
    render json: { message: '成功しました', data: Recruitment.find(params[:id]) }, status: 200
  end

  def destroy
    recruitment = Recruitment.find(params[:id])
    return render json: { message: '削除に成功しました' }, status: 200 if recruitment.destroy
    
    render json: { message: '削除に失敗しました' }, status: 400
  end

  private

  def create_params
    params
    .permit(:image, :name, :area, :sex, :number, :start_date, :end_date,
      :purpose_body, :other_body, :sports_type_id, :prefecture_id, 
      sports_discipline_ids: [], target_age_ids: []
    )
    .merge(user_id: current_user.id)
  end
end
