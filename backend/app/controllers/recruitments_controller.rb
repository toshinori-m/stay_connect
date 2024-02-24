class RecruitmentsController < ApplicationController
  before_action :authenticate, except: [:show]
  
  def create
    recruitment = current_user.recruitments.new(create_params)
    
    recruitment.save!
    head :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.messages }, status: :unprocessable_entity 
  end

  def update
    recruitment = Recruitment.find(params[:id])
  
    recruitment.update!(create_params)
    head :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.messages }, status: :unprocessable_entity
  end

  def index
    recruitments = current_user.recruitments
    render json: { message: '成功しました', data: recruitments }, status: 200
  end

  def show
    @recruitment = Recruitment.find(params[:id])
  end

  def destroy
    recruitment = Recruitment.find(params[:id])
    recruitment.destroy!
    @recruitments = current_user.recruitment.preload(:sports_disciplines, :target_ages)
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: '対象の募集が見つかりません。' }, status: :not_found
  rescue ActiveRecord::RecordNotDestroyed => e
    render json: { error: '削除に失敗しました。', errors: e.record.errors.messages }, status: :internal_server_error
  end

  private

  def create_params
    params
    .require(:recruitment)
    .permit(:image, :name, :area, :sex, :number, :start_date, :end_date,
      :purpose_body, :other_body, :sports_type_id, :prefecture_id, 
      sports_discipline_ids: [], target_age_ids: []
    )
  end
end
