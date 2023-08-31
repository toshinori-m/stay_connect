class RecruitmentsController < ApplicationController
  before_action :authenticate_user!, except: [:show, :index]
  
  def create
    recruitments = Recruitment.new(create_params)
    return render json: { message: '成功しました', data: recruitments }, status: 200 if recruitments.save

    render json: { message: '保存出来ませんでした', errors: recruitments.errors.messages }, status: 400
  end

  def update
    recruitment = Recruitment.find(params[:id])
    return render json: { message: '成功しました', data: recruitment }, status: 200 if recruitment.update(create_params)

    render json: { message: '保存出来ませんでした', errors: recruitment.errors }, status: 400
  end

  def index
    recruitments = Recruitment.all
    render json: { message: '成功しました', data: recruitments }, status: 200
  end

  def show
    render json: { message: '成功しました', data: Recruitment.find(params[:id]) }, status: 200
  end

  def destroy
    recruitment = Recruitment.find(params[:id])
    return render json: { message: '削除に成功しました', data: recruitment }, status: 200 if recruitment.destroy
    
    render json: { message: '削除に失敗' }, status: 400
  end

  private

  def create_params
    params
    .permit(:image, :name, :area, :sex, :number, :start_date, :end_date,
     :purpose_body, :other_body, :sports_type_id, :prefecture_id, target_age_ids: [] )
    .merge(user_id: current_user.id )
  end
end
